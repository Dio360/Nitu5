import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { AddEvidenceDto, OpenDisputeDto } from "./dto";

/**
 * Structured fights-about-money-or-truth (PRD §25–26).
 * Everything the judge needs is bundled in one place.
 */
@Controller("disputes")
@UseGuards(JwtGuard)
export class DisputesController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  async open(@CurrentUser() me: AuthUser, @Body() dto: OpenDisputeDto) {
    const booking = await this.db.booking.findUnique({
      where: { id: dto.bookingId },
      include: { trip: true },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    const mine = booking.riderId === me.userId || booking.trip.driverId === me.userId;
    if (!mine) throw new ForbiddenException("Only rider or driver of this booking");
    return this.db.dispute.create({
      data: {
        bookingId: booking.id,
        type: dto.type,
        evidence: { notes: dto.details ? [dto.details] : [], openedBy: me.userId },
      },
    });
  }

  @Get("mine")
  async mine(@CurrentUser() me: AuthUser) {
    const bookings = await this.db.booking.findMany({
      where: { OR: [{ riderId: me.userId }, { trip: { driverId: me.userId } }] },
      select: { id: true },
    });
    return this.db.dispute.findMany({
      where: { bookingId: { in: bookings.map((b) => b.id) } },
      orderBy: { createdAt: "desc" },
    });
  }

  /** The whole case file: deal + haggle history + QR scans + safety flags. */
  @Get(":id")
  async one(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    const dispute = await this.db.dispute.findUnique({
      where: { id },
      include: { booking: { include: { trip: true } } },
    });
    if (!dispute) throw new NotFoundException("Dispute not found");
    const mine =
      dispute.booking.riderId === me.userId || dispute.booking.trip.driverId === me.userId;
    if (!mine) throw new ForbiddenException("Not your case");
    const [negotiations, qrAttempts, safetyReports] = await Promise.all([
      this.db.negotiation.findMany({ where: { bookingId: dispute.bookingId }, orderBy: { createdAt: "asc" } }),
      this.db.qrAttempt.findMany({ where: { bookingId: dispute.bookingId }, orderBy: { createdAt: "asc" } }),
      this.db.safetyReport.findMany({ where: { tripId: dispute.booking.tripId }, orderBy: { createdAt: "asc" } }),
    ]);
    return { dispute, negotiations, qrAttempts, safetyReports };
  }

  @Post(":id/evidence")
  async addEvidence(@CurrentUser() me: AuthUser, @Param("id") id: string, @Body() dto: AddEvidenceDto) {
    const dispute = await this.db.dispute.findUnique({
      where: { id },
      include: { booking: { include: { trip: true } } },
    });
    if (!dispute) throw new NotFoundException("Dispute not found");
    const mine =
      dispute.booking.riderId === me.userId || dispute.booking.trip.driverId === me.userId;
    if (!mine) throw new ForbiddenException("Not your case");
    const evidence = (dispute.evidence ?? {}) as { notes?: string[] };
    const notes = [...(evidence.notes ?? []), `${me.userId}: ${dto.note}`];
    return this.db.dispute.update({
      where: { id },
      data: { status: "EVIDENCE", evidence: { ...evidence, notes } },
    });
  }
}
