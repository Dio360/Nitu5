import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";

@Controller("notifications")
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly db: PrismaService) {}

  @Get("mine")
  mine(@CurrentUser() me: AuthUser) {
    return this.db.notification.findMany({
      where: { userId: me.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  @Post(":id/read")
  read(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.db.notification.updateMany({
      where: { id, userId: me.userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
