import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { OpenTicketDto } from "./dto";

/** Help desk + lost & found (PRD §45–46). Humans answer in the admin app later. */
@Controller("support")
@UseGuards(JwtGuard)
export class SupportController {
  constructor(private readonly db: PrismaService) {}

  @Post("tickets")
  open(@CurrentUser() me: AuthUser, @Body() dto: OpenTicketDto) {
    return this.db.supportTicket.create({
      data: {
        userId: me.userId,
        category: dto.category ?? "HELP",
        subject: dto.subject,
        message: dto.message,
        tripId: dto.tripId,
      },
    });
  }

  @Get("tickets/mine")
  mine(@CurrentUser() me: AuthUser) {
    return this.db.supportTicket.findMany({
      where: { userId: me.userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
