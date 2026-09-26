import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CreateRatingDto } from "./dto";

/** Two-way ratings — only people who finished the trip together (PRD §23). */
@Controller("ratings")
@UseGuards(JwtGuard)
export class RatingsController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  async rate(@CurrentUser() me: AuthUser, @Body() dto: CreateRatingDto) {
    if (dto.rateeId === me.userId) throw new BadRequestException("You cannot rate yourself");
    const trip = await this.db.trip.findUnique({
      where: { id: dto.tripId },
      include: { bookings: true },
    });
    if (!trip || trip.status !== "COMPLETED") throw new NotFoundException("Finished trip not found");
    const tookPart =
      trip.driverId === me.userId || trip.bookings.some((b) => b.riderId === me.userId && b.status === "COMPLETED");
    if (!tookPart) throw new ForbiddenException("Only riders and driver of this trip can rate");
    const otherSide =
      trip.driverId === dto.rateeId || trip.bookings.some((b) => b.riderId === dto.rateeId);
    if (!otherSide) throw new BadRequestException("You can only rate people from this trip");
    try {
      const rating = await this.db.rating.create({
        data: { tripId: dto.tripId, raterId: me.userId, rateeId: dto.rateeId, score: dto.score, comment: dto.comment },
      });
      const agg = await this.db.rating.aggregate({ where: { rateeId: dto.rateeId }, _avg: { score: true } });
      await this.db.user.update({
        where: { id: dto.rateeId },
        data: { rating: agg._avg.score == null ? null : Math.round(agg._avg.score * 10) / 10 },
      });
      return rating;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("You already rated this trip");
      }
      throw e;
    }
  }
}
