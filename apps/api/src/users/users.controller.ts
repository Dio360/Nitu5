import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { UpdateMeDto } from "./dto";

@Controller("me")
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly db: PrismaService) {}

  @Get()
  me(@CurrentUser() me: AuthUser) {
    return this.db.user.findUnique({
      where: { id: me.userId },
      include: { vehicles: true, wallet: true },
    });
  }

  @Patch()
  update(@CurrentUser() me: AuthUser, @Body() dto: UpdateMeDto) {
    return this.db.user.update({ where: { id: me.userId }, data: dto });
  }
}
