import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CreateTripDto } from "./dto";
import { SearchTripsDto } from "./search.dto";
import { GeocodeService } from "./geocode.service";

import { BookingsService } from "../bookings/bookings.service";
import { NotifyService } from "../notify/notify.service";

const DRIVER_ROLES = ["PRIVATE_DRIVER", "PROFESSIONAL_DRIVER"];
const OPEN = ["BOOKING_OPEN", "CONFIRMED", "NEARLY_FULL"] as const;

const DRIVER_SELECT = {
  firstName: true,
  lastName: true,
  rating: true,
  verificationTier: true,
  driverType: true,
} as const;

@Controller("trips")
export class TripsController {
  constructor(
    private readonly db: PrismaService,
    private readonly geo: GeocodeService,
    private readonly bookings: BookingsService,
    private readonly notify: NotifyService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@CurrentUser() me: AuthUser, @Body() dto: CreateTripDto) {
    if (!DRIVER_ROLES.includes(me.role)) {
      throw new ForbiddenException("Switch to a driver account first (PATCH /me)");
    }
    if (dto.rideModel === "SHARED" && dto.farePerSeatKobo == null) {
      throw new BadRequestException("Shared trips need farePerSeatKobo (price per seat)");
    }
    if (dto.rideModel === "PRIVATE" && dto.privateFareKobo == null) {
      throw new BadRequestException("Private trips need privateFareKobo (whole-car price)");
    }
    const trip = await this.db.trip.create({
      data: {
        driverId: me.userId,
        rideModel: dto.rideModel,
        tripType: dto.tripType,
        originLabel: dto.originLabel,
        destinationLabel: dto.destinationLabel,
        departureAt: new Date(dto.departureAt),
        seatsTotal: dto.seatsTotal,
        farePerSeatKobo: dto.farePerSeatKobo,
        privateFareKobo: dto.privateFareKobo,
        status: "BOOKING_OPEN",
      },
    });
    // Map points: GPS from the phone wins; address lookup is a fallback.
    const from =
      dto.originLat != null && dto.originLng != null
        ? { lat: dto.originLat, lng: dto.originLng }
        : await this.geo.geocode(dto.originLabel);
    const to =
      dto.destLat != null && dto.destLng != null
        ? { lat: dto.destLat, lng: dto.destLng }
        : await this.geo.geocode(dto.destinationLabel);
    if (from) {
      await this.db.$executeRaw`
        UPDATE "Trip" SET "originGeom" = ST_SetSRID(ST_MakePoint(${from.lng}, ${from.lat}), 4326)
        WHERE id = ${trip.id}`;
    }
    if (to) {
      await this.db.$executeRaw`
        UPDATE "Trip" SET "corridorGeom" = ST_SetSRID(ST_MakePoint(${to.lng}, ${to.lat}), 4326)
        WHERE id = ${trip.id}`;
    }
    return this.db.trip.findUnique({ where: { id: trip.id } });
  }

  /** My trips as a driver (newest first). */
  @Get("mine")
  @UseGuards(JwtGuard)
  mine(@CurrentUser() me: AuthUser) {
    return this.db.trip.findMany({
      where: { driverId: me.userId },
      orderBy: { departureAt: "desc" },
      take: 50,
    });
  }

  /** Driver cancels their own trip. Wallet holds are refunded. */
  @Post(":id/cancel")
  @UseGuards(JwtGuard)
  async cancel(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.db.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({ where: { id, driverId: me.userId }, include: { bookings: true } });
      if (!trip) throw new NotFoundException("Trip not found");
      for (const b of trip.bookings) {
        if (b.status !== "CONFIRMED" && b.status !== "QR_VERIFIED") continue;
        await tx.booking.update({ where: { id: b.id }, data: { status: "CANCELLED" } });
        await this.notify.notify(b.riderId, "TRIP_CANCELLED", { tripId: id });
        if (b.paymentMethod === "WALLET" && b.agreedFareKobo != null) {
          const wallet = await tx.wallet.upsert({
            where: { userId: b.riderId },
            update: { balanceKobo: { increment: b.agreedFareKobo } },
            create: { userId: b.riderId, balanceKobo: b.agreedFareKobo },
          });
          await tx.ledgerEntry.create({
            data: {
              walletId: wallet.id,
              bookingId: b.id,
              creditKobo: b.agreedFareKobo,
              type: "RELEASE",
              idempotencyKey: `release-${b.id}`,
            },
          });
        }
      }
      return tx.trip.update({ where: { id }, data: { status: "CANCELLED" } });
    });
  }

  /** "I'm here" — driver at the pickup point. */
  @Post(":id/arriving")
  @UseGuards(JwtGuard)
  async arriving(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    const trip = await this.db.trip.findFirst({ where: { id, driverId: me.userId } });
    if (!trip) throw new NotFoundException("Trip not found");
    return this.db.trip.update({ where: { id }, data: { status: "DRIVER_ARRIVING" } });
  }

  /**
   * Wheels rolling. Every confirmed seat must be QR-checked first,
   * and at least one rider must be aboard.
   */
  @Post(":id/start")
  @UseGuards(JwtGuard)
  async start(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    const trip = await this.db.trip.findFirst({
      where: { id, driverId: me.userId },
      include: { bookings: true },
    });
    if (!trip) throw new NotFoundException("Trip not found");
    const unverified = trip.bookings.filter((b) => b.status === "CONFIRMED");
    if (unverified.length > 0) {
      throw new BadRequestException(`${unverified.length} rider(s) still need QR check-in`);
    }
    const aboard = trip.bookings.filter((b) => b.status === "QR_VERIFIED");
    if (aboard.length === 0) throw new BadRequestException("No checked-in riders — nobody to carry");
    await this.db.booking.updateMany({
      where: { tripId: id, status: "QR_VERIFIED" },
      data: { status: "IN_PROGRESS" },
    });
    for (const b of aboard) {
      await this.notify.notify(b.riderId, "TRIP_STARTED", { tripId: id });
    }
    return this.db.trip.update({ where: { id }, data: { status: "IN_PROGRESS" } });
  }

  /** Journey done. Wallet drivers get paid; cash is marked received. */
  @Post(":id/complete")
  @UseGuards(JwtGuard)
  async complete(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.db.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({ where: { id, driverId: me.userId }, include: { bookings: true } });
      if (!trip) throw new NotFoundException("Trip not found");
      if (trip.status !== "IN_PROGRESS") throw new BadRequestException("Start the trip first");
      for (const b of trip.bookings) {
        if (b.status !== "IN_PROGRESS") continue;
        await tx.booking.update({ where: { id: b.id }, data: { status: "COMPLETED" } });
        if (b.paymentMethod === "WALLET") {
          const wallet = await tx.wallet.upsert({
            where: { userId: trip.driverId },
            update: { balanceKobo: { increment: b.driverEarningsKobo } },
            create: { userId: trip.driverId, balanceKobo: b.driverEarningsKobo },
          });
          await tx.ledgerEntry.create({
            data: {
              walletId: wallet.id,
              bookingId: b.id,
              creditKobo: b.driverEarningsKobo,
              type: "PAYOUT",
              idempotencyKey: `payout-${b.id}`,
            },
          });
        }
        await tx.user.update({ where: { id: b.riderId }, data: { tripsCompleted: { increment: 1 } } });
      }
      await tx.booking.updateMany({
        where: { tripId: id, paymentMethod: "CASH" },
        data: { paymentStatus: "CASH_RECORDED" },
      });
      await tx.user.update({ where: { id: trip.driverId }, data: { tripsCompleted: { increment: 1 } } });
      for (const b of trip.bookings) {
        if (b.status === "IN_PROGRESS") {
          await this.notify.notify(b.riderId, "TRIP_COMPLETED", { tripId: id, bookingId: b.id });
        }
      }
      return tx.trip.update({ where: { id }, data: { status: "COMPLETED" } });
    });
  }

  /** Who is in my car? Driver-only passenger list (PRD §40). */
  @Get(":id/manifest")
  @UseGuards(JwtGuard)
  async manifest(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    const trip = await this.db.trip.findFirst({ where: { id, driverId: me.userId } });
    if (!trip) throw new NotFoundException("Trip not found");
    return this.db.booking.findMany({
      where: { tripId: id },
      orderBy: { createdAt: "asc" },
      include: {
        rider: {
          select: { firstName: true, lastName: true, rating: true, verificationTier: true },
        },
      },
    });
  }

  @Get("search")
  async search(@Query() q: SearchTripsDto) {
    const pax = q.seats ?? 1;
    const day = q.date ? new Date(`${q.date}T00:00:00Z`) : null;
    const dayEnd = q.date ? new Date(`${q.date}T23:59:59Z`) : null;

    // Map search: rank by distance from the rider's point.
    if (q.fromLat != null && q.fromLng != null) {
      const radiusM = Math.round((q.radiusKm ?? 5) * 1000);
      const rows = await this.db.$queryRaw<Array<{ id: string; meters: number }>>`
        SELECT id,
          ST_Distance("originGeom"::geography,
            ST_SetSRID(ST_MakePoint(${q.fromLng}, ${q.fromLat}), 4326)::geography) AS meters
        FROM "Trip"
        WHERE status::text IN (${Prisma.join(OPEN as unknown as string[])})
          AND "departureAt" >= NOW()
          AND ("seatsTotal" - "seatsBooked") >= ${pax}
          AND "originGeom" IS NOT NULL
          AND ST_DWithin("originGeom"::geography,
            ST_SetSRID(ST_MakePoint(${q.fromLng}, ${q.fromLat}), 4326)::geography, ${radiusM})
        ORDER BY meters ASC
        LIMIT 30`;
      const trips = await this.db.trip.findMany({
        where: { id: { in: rows.map((r) => r.id) } },
        include: { driver: { select: DRIVER_SELECT } },
      });
      const byId = new Map(trips.map((t) => [t.id, t]));
      return rows
        .map((r) => {
          const t = byId.get(r.id);
          return t ? { ...t, distanceMeters: Math.round(r.meters), seatsLeft: t.seatsTotal - t.seatsBooked } : null;
        })
        .filter((t): t is NonNullable<typeof t> => t !== null);
    }

    // Label search (default).
    const trips = await this.db.trip.findMany({
      where: {
        status: { in: [...OPEN] },
        departureAt: { gte: day ?? new Date(), ...(dayEnd ? { lte: dayEnd } : {}) },
        ...(q.from ? { originLabel: { contains: q.from, mode: "insensitive" } } : {}),
        ...(q.to ? { destinationLabel: { contains: q.to, mode: "insensitive" } } : {}),
        ...(q.rideModel ? { rideModel: q.rideModel } : {}),
        ...(q.tripType ? { tripType: q.tripType } : {}),
      },
      orderBy: { departureAt: "asc" },
      take: 30,
      include: { driver: { select: DRIVER_SELECT } },
    });
    return trips
      .filter((t) => t.seatsTotal - t.seatsBooked >= pax)
      .map((t) => ({ ...t, seatsLeft: t.seatsTotal - t.seatsBooked }));
  }

  /** Driver sees all price offers on their trip. */
  @Get(":id/offers")
  @UseGuards(JwtGuard)
  offers(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.bookings.tripOffers(me.userId, id);
  }

  /** Public earnings preview before offering (PRD §32). */
  @Get(":id/quote")
  quote(@Param("id") id: string, @Query("amountKobo") amount: string) {
    return this.bookings.quote(id, Number(amount));
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    const trip = await this.db.trip.findUnique({
      where: { id },
      include: {
        driver: { select: DRIVER_SELECT },
        bookings: { select: { id: true, seats: true, status: true } },
      },
    });
    if (!trip) throw new NotFoundException("Trip not found");
    return { ...trip, seatsLeft: trip.seatsTotal - trip.seatsBooked };
  }
}
