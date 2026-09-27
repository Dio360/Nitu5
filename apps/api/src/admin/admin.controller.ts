import { Body, Controller, Get, NotFoundException, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser } from "../auth/jwt.guard";
import { AdminGuard } from "./admin.guard";
import { DecideDisputeDto, SafetyStatusDto, TicketStatusDto, UpdateUserDto, VerifyVehicleDto } from "./dto";

/** Back office: people, cars, trips, cases, flags, tickets. */
@Controller("admin")
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly db: PrismaService) {}

  @Get("overview")
  async overview() {
    const [users, trips, bookings, openDisputes, openSafety, openTickets] = await Promise.all([
      this.db.user.count(),
      this.db.trip.count(),
      this.db.booking.findMany({
        where: { status: "COMPLETED" },
        select: { agreedFareKobo: true, commissionKobo: true },
      }),
      this.db.dispute.count({ where: { status: { in: ["OPEN", "EVIDENCE", "REVIEW"] } } }),
      this.db.safetyReport.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
      this.db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    ]);
    return {
      users,
      trips,
      completedBookings: bookings.length,
      grossKobo: bookings.reduce((a, b) => a + (b.agreedFareKobo ?? 0), 0),
      feesKobo: bookings.reduce((a, b) => a + b.commissionKobo, 0),
      openDisputes,
      openSafety,
      openTickets,
    };
  }

  @Get("users")
  users(@Query("search") search?: string) {
    return this.db.user.findMany({
      where: search
        ? { OR: [{ phone: { contains: search } }, { firstName: { contains: search, mode: "insensitive" } }] }
        : {},
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        verificationTier: true,
        rating: true,
        tripsCompleted: true,
        createdAt: true,
      },
    });
  }

  @Patch("users/:id")
  async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return this.db.user.update({ where: { id }, data: dto });
  }

  @Get("vehicles")
  vehicles(@Query("status") status?: string) {
    return this.db.vehicle.findMany({
      where: status ? { verificationStatus: status as never } : {},
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { driver: { select: { firstName: true, lastName: true, phone: true } } },
    });
  }

  @Patch("vehicles/:id")
  verifyVehicle(@Param("id") id: string, @Body() dto: VerifyVehicleDto) {
    return this.db.vehicle.update({ where: { id }, data: { verificationStatus: dto.status } });
  }

  @Get("trips")
  trips() {
    return this.db.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        driver: { select: { firstName: true, lastName: true, phone: true } },
        _count: { select: { bookings: true } },
      },
    });
  }

  @Get("disputes")
  disputes() {
    return this.db.dispute.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { booking: { select: { offeredFareKobo: true, agreedFareKobo: true, status: true } } },
    });
  }

  @Get("disputes/:id")
  async disputeCase(@Param("id") id: string) {
    const dispute = await this.db.dispute.findUnique({
      where: { id },
      include: { booking: { include: { trip: true, rider: { select: { firstName: true, lastName: true, phone: true } } } } },
    });
    if (!dispute) throw new NotFoundException("Dispute not found");
    const [negotiations, qrAttempts, safetyReports] = await Promise.all([
      this.db.negotiation.findMany({ where: { bookingId: dispute.bookingId }, orderBy: { createdAt: "asc" } }),
      this.db.qrAttempt.findMany({ where: { bookingId: dispute.bookingId }, orderBy: { createdAt: "asc" } }),
      this.db.safetyReport.findMany({ where: { tripId: dispute.booking.tripId }, orderBy: { createdAt: "asc" } }),
    ]);
    return { dispute, negotiations, qrAttempts, safetyReports };
  }

  @Patch("disputes/:id/decide")
  async decide(@CurrentUser() me: AuthUser, @Param("id") id: string, @Body() dto: DecideDisputeDto) {
    const dispute = await this.db.dispute.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException("Dispute not found");
    const evidence = (dispute.evidence ?? {}) as Record<string, unknown>;
    return this.db.dispute.update({
      where: { id },
      data: { status: dto.status, evidence: { ...evidence, decision: dto.decision, decidedBy: me.userId } },
    });
  }

  @Get("safety")
  safety() {
    return this.db.safetyReport.findMany({
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
      take: 50,
      include: { reporter: { select: { firstName: true, lastName: true, phone: true } } },
    });
  }

  @Patch("safety/:id")
  async safetyStatus(@Param("id") id: string, @Body() dto: SafetyStatusDto) {
    return this.db.safetyReport.update({ where: { id }, data: { status: dto.status } });
  }

  @Get("support")
  support() {
    return this.db.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { firstName: true, lastName: true, phone: true } } },
    });
  }

  @Patch("support/:id")
  ticketStatus(@Param("id") id: string, @Body() dto: TicketStatusDto) {
    return this.db.supportTicket.update({ where: { id }, data: { status: dto.status } });
  }
}
