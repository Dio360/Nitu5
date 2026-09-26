import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { computeEarnings } from "@nitu5/domain";
import { PrismaService } from "../prisma.service";

const OPEN = ["BOOKING_OPEN", "CONFIRMED", "NEARLY_FULL"];

/** Nitu5 cut: shared trips pay less commission to encourage sharing (PRD §31). */
const COMMISSION: Record<string, number> = { SHARED: 0.1, PRIVATE: 0.15 };

@Injectable()
export class BookingsService {
  constructor(private readonly db: PrismaService) {}

  async offer(riderId: string, dto: { tripId: string; seats: number; offeredFareKobo: number; pickupLabel: string; dropoffLabel: string; paymentMethod: string }) {
    const trip = await this.db.trip.findUnique({ where: { id: dto.tripId } });
    if (!trip || !OPEN.includes(trip.status)) throw new NotFoundException("Trip not open for booking");
    if (trip.driverId === riderId) throw new ForbiddenException("You cannot book your own trip");
    if (trip.seatsTotal - trip.seatsBooked < dto.seats) {
      throw new BadRequestException("Not enough free seats left");
    }
    const booking = await this.db.booking.create({
      data: {
        tripId: trip.id,
        riderId,
        seats: dto.seats,
        pickupLabel: dto.pickupLabel,
        dropoffLabel: dto.dropoffLabel,
        offeredFareKobo: dto.offeredFareKobo,
        paymentMethod: dto.paymentMethod as never,
        status: "OFFERED",
      },
    });
    await this.db.negotiation.create({
      data: { bookingId: booking.id, actorId: riderId, amountKobo: dto.offeredFareKobo, action: "OFFER" },
    });
    return booking;
  }

  /** Driver accepts the rider's offer — seats reserved here, inside one transaction. */
  async accept(driverId: string, bookingId: string) {
    return this.confirm(bookingId, driverId, "driver", null);
  }

  /** Rider accepts the driver's counter — same reservation path. */
  async agree(riderId: string, bookingId: string) {
    return this.confirm(bookingId, riderId, "rider", null);
  }

  private async confirm(bookingId: string, userId: string, who: "driver" | "rider", _unused: null) {
    return this.db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true },
      });
      if (!booking) throw new NotFoundException("Booking not found");
      if (who === "driver" && booking.trip.driverId !== userId) {
        throw new ForbiddenException("Only the trip driver can accept");
      }
      if (who === "rider") {
        if (booking.riderId !== userId) throw new ForbiddenException("Only the rider can agree");
        if (booking.status !== "COUNTERED") throw new BadRequestException("No counter to agree to");
      } else if (booking.status !== "OFFERED" && booking.status !== "COUNTERED") {
        throw new BadRequestException(`Booking is ${booking.status} — nothing to accept`);
      }
      const price = who === "rider" ? await this.lastCounter(tx, bookingId) : booking.offeredFareKobo;
      const left = booking.trip.seatsTotal - booking.trip.seatsBooked;
      if (left < booking.seats) throw new BadRequestException("Just sold out — not enough seats left");
      const split = computeEarnings(price, COMMISSION[booking.trip.rideModel] ?? 0.1);
      // Wallet riders pay now (held); cash/card pay outside the app for now.
      if (booking.paymentMethod === "WALLET") {
        const wallet = await tx.wallet.upsert({
          where: { userId: booking.riderId },
          update: {},
          create: { userId: booking.riderId },
        });
        if (wallet.balanceKobo < split.fare.kobo) {
          throw new BadRequestException("Wallet too low — top up first");
        }
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balanceKobo: { decrement: split.fare.kobo } },
        });
        await tx.ledgerEntry.create({
          data: {
            walletId: wallet.id,
            bookingId,
            debitKobo: split.fare.kobo,
            type: "HOLD",
            idempotencyKey: `hold-${bookingId}`,
          },
        });
      }
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          agreedFareKobo: split.fare.kobo,
          commissionKobo: split.fee.kobo,
          driverEarningsKobo: split.driverEarnings.kobo,
        },
      });
      const booked = booking.trip.seatsBooked + booking.seats;
      await tx.trip.update({
        where: { id: booking.tripId },
        data: {
          seatsBooked: booked,
          status: booked >= booking.trip.seatsTotal ? "FULL" : "CONFIRMED",
        },
      });
      await tx.negotiation.create({
        data: { bookingId, actorId: userId, amountKobo: price, action: "ACCEPT" },
      });
      return updated;
    });
  }

  private async lastCounter(tx: { negotiation: { findFirst: (a: never) => Promise<{ amountKobo: number } | null> } }, bookingId: string): Promise<number> {
    const last = await tx.negotiation.findFirst({
      where: { bookingId, action: "COUNTER" },
      orderBy: { createdAt: "desc" },
    } as never);
    if (!last) throw new BadRequestException("No counter to agree to");
    return last.amountKobo;
  }

  async counter(driverId: string, bookingId: string, amountKobo: number) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.trip.driverId !== driverId) throw new ForbiddenException("Only the trip driver can counter");
    if (booking.status !== "OFFERED" && booking.status !== "COUNTERED") {
      throw new BadRequestException(`Booking is ${booking.status} — cannot counter`);
    }
    const updated = await this.db.booking.update({
      where: { id: bookingId },
      data: { status: "COUNTERED", offeredFareKobo: amountKobo },
    });
    await this.db.negotiation.create({
      data: { bookingId, actorId: driverId, amountKobo, action: "COUNTER" },
    });
    return updated;
  }

  async decline(driverId: string, bookingId: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.trip.driverId !== driverId) throw new ForbiddenException("Only the trip driver can decline");
    const updated = await this.db.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
    await this.db.negotiation.create({
      data: { bookingId, actorId: driverId, amountKobo: booking.offeredFareKobo, action: "DECLINE" },
    });
    return updated;
  }

  async riderCancel(riderId: string, bookingId: string) {
    const booking = await this.db.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.riderId !== riderId) throw new NotFoundException("Booking not found");
    if (booking.status !== "OFFERED" && booking.status !== "COUNTERED") {
      throw new BadRequestException("Too late to cancel this offer");
    }
    return this.db.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  }

  riderBookings(riderId: string) {
    return this.db.booking.findMany({
      where: { riderId },
      orderBy: { createdAt: "desc" },
      include: { trip: { select: { originLabel: true, destinationLabel: true, departureAt: true } } },
    });
  }

  tripOffers(driverId: string, tripId: string) {
    return this.db.booking
      .findMany({
        where: { tripId },
        orderBy: { createdAt: "desc" },
        include: {
          trip: { select: { driverId: true } },
          rider: { select: { firstName: true, lastName: true, rating: true, verificationTier: true } },
        },
      })
      .then((rows) => {
        const mine = rows.filter((r) => r.trip.driverId === driverId);
        if (rows.length && !mine.length) throw new ForbiddenException("Not your trip");
        return mine;
      });
  }

  history(bookingId: string) {
    return this.db.negotiation.findMany({ where: { bookingId }, orderBy: { createdAt: "asc" } });
  }

  /** Earnings preview before anyone commits (PRD §32). */
  async quote(tripId: string, amountKobo: number) {
    const trip = await this.db.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException("Trip not found");
    const split = computeEarnings(amountKobo, COMMISSION[trip.rideModel] ?? 0.1);
    return {
      fareKobo: split.fare.kobo,
      feeKobo: split.fee.kobo,
      driverEarningsKobo: split.driverEarnings.kobo,
      commissionRate: COMMISSION[trip.rideModel] ?? 0.1,
    };
  }
}
