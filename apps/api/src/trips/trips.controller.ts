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
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CreateTripDto, SearchTripsDto } from "./dto";

const DRIVER_ROLES = ["PRIVATE_DRIVER", "PROFESSIONAL_DRIVER"];

@Controller("trips")
export class TripsController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@CurrentUser() me: AuthUser, @Body() dto: CreateTripDto) {
    if (!DRIVER_ROLES.includes(me.role)) {
      throw new ForbiddenException("Switch to a driver account first (PATCH /me)");
    }
    if (dto.rideModel === "SHARED" && dto.farePerSeatKobo == null) {
      throw new BadRequestException("Shared trips need farePerSeatKobo (price per seat)");
    }
    if (dto.rideModel === "PRIVATE" && dto.privateFareKobo == null) {
      throw new BadRequestException("Private trips need privateFareKobo (whole-car price)");
    }
    return this.db.trip.create({
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
  }

  /** Public search — label match for now, map matching lands in Phase B. */
  @Get("search")
  search(@Query() q: SearchTripsDto) {
    return this.db.trip.findMany({
      where: {
        status: { in: ["BOOKING_OPEN", "CONFIRMED", "NEARLY_FULL"] },
        departureAt: { gte: new Date() },
        ...(q.from ? { originLabel: { contains: q.from, mode: "insensitive" } } : {}),
        ...(q.to ? { destinationLabel: { contains: q.to, mode: "insensitive" } } : {}),
      },
      orderBy: { departureAt: "asc" },
      take: 30,
      include: {
        driver: {
          select: { firstName: true, lastName: true, rating: true, verificationTier: true, driverType: true },
        },
      },
    });
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    const trip = await this.db.trip.findUnique({
      where: { id },
      include: {
        driver: {
          select: { firstName: true, lastName: true, rating: true, verificationTier: true, driverType: true },
        },
        bookings: { select: { id: true, seats: true, status: true } },
      },
    });
    if (!trip) throw new NotFoundException("Trip not found");
    return trip;
  }
}
