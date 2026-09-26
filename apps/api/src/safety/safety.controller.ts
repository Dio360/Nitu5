import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { ReportDto, SosDto } from "./dto";

@Controller("safety")
@UseGuards(JwtGuard)
export class SafetyController {
  constructor(private readonly db: PrismaService) {}

  /**
   * Big red button. Always works, trip or not.
   * Safety team SLA: 5 minutes.
   */
  @Post("sos")
  async sos(@CurrentUser() me: AuthUser, @Body() dto: SosDto) {
    const report = await this.db.safetyReport.create({
      data: {
        tripId: dto.tripId,
        reporterId: me.userId,
        category: "SOS",
        severity: "critical",
        slaDueAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    return {
      reportId: report.id,
      message: "SOS received — help is being alerted. Stay safe, stay on the line.",
    };
  }

  @Post("reports")
  report(@CurrentUser() me: AuthUser, @Body() dto: ReportDto) {
    return this.db.safetyReport.create({
      data: {
        tripId: dto.tripId,
        reporterId: me.userId,
        category: dto.category,
        severity: dto.severity ?? "normal",
      },
    });
  }

  @Get("mine")
  mine(@CurrentUser() me: AuthUser) {
    return this.db.safetyReport.findMany({
      where: { reporterId: me.userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
