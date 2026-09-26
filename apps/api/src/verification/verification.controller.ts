import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { SubmitVerificationDto } from "./dto";

/**
 * Dev-edition verification: step up one level at a time.
 * Human + document review lands in a later phase.
 */
const ORDER = ["L0_NONE", "L1_ACCOUNT", "L2_IDENTITY", "L3_DRIVER_VEHICLE", "L4_FULLY_VERIFIED"] as const;

@Controller("verification")
@UseGuards(JwtGuard)
export class VerificationController {
  constructor(private readonly db: PrismaService) {}

  @Post("submit")
  async submit(@CurrentUser() me: AuthUser, @Body() dto: SubmitVerificationDto) {
    const user = await this.db.user.findUnique({ where: { id: me.userId } });
    if (!user) throw new BadRequestException("Account not found");
    const currentIdx = ORDER.indexOf(user.verificationTier);
    const wantedIdx = ORDER.indexOf(dto.level);
    if (wantedIdx !== currentIdx + 1) {
      throw new BadRequestException(`Submit levels in order — you are ${user.verificationTier}`);
    }
    if (dto.level === "L3_DRIVER_VEHICLE") {
      const cars = await this.db.vehicle.count({ where: { driverId: me.userId } });
      if (cars === 0) throw new BadRequestException("Register a car first (POST /me/vehicles)");
    }
    return this.db.user.update({ where: { id: me.userId }, data: { verificationTier: dto.level } });
  }
}
