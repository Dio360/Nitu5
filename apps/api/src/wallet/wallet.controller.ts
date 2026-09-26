import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IsInt, Min } from "class-validator";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";

class TopupDto {
  @IsInt()
  @Min(100)
  amountKobo!: number;
}

@Controller("wallet")
@UseGuards(JwtGuard)
export class WalletController {
  constructor(private readonly db: PrismaService) {}

  /** Balance + recent money moves. */
  @Get("mine")
  async mine(@CurrentUser() me: AuthUser) {
    const wallet = await this.db.wallet.upsert({
      where: { userId: me.userId },
      update: {},
      create: { userId: me.userId },
    });
    const entries = await this.db.ledgerEntry.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return { balanceKobo: wallet.balanceKobo, entries };
  }

  /** Dev stand-in for card funding (Paystack replaces this later). */
  @Post("topup")
  async topup(@CurrentUser() me: AuthUser, @Body() dto: TopupDto) {
    const wallet = await this.db.wallet.upsert({
      where: { userId: me.userId },
      update: { balanceKobo: { increment: dto.amountKobo } },
      create: { userId: me.userId, balanceKobo: dto.amountKobo },
    });
    await this.db.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        creditKobo: dto.amountKobo,
        type: "PAYOUT",
        idempotencyKey: `topup-${me.userId}-${Date.now()}`,
      },
    });
    return { balanceKobo: wallet.balanceKobo };
  }
}
