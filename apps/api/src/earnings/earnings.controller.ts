import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";

/** "How am I doing?" — money in, money out, one screen. */
@Controller("earnings")
@UseGuards(JwtGuard)
export class EarningsController {
  constructor(private readonly db: PrismaService) {}

  @Get("me")
  async me(@CurrentUser() me: AuthUser) {
    const [asDriver, asRider, wallet] = await Promise.all([
      this.db.booking.findMany({
        where: { trip: { driverId: me.userId }, status: { in: ["CONFIRMED", "QR_VERIFIED", "IN_PROGRESS", "COMPLETED"] } },
        select: { agreedFareKobo: true, commissionKobo: true, driverEarningsKobo: true, status: true },
      }),
      this.db.booking.findMany({
        where: { riderId: me.userId, status: { in: ["CONFIRMED", "QR_VERIFIED", "IN_PROGRESS", "COMPLETED"] } },
        select: { agreedFareKobo: true, status: true },
      }),
      this.db.wallet.findUnique({ where: { userId: me.userId } }),
    ]);
    const sum = (rows: Array<{ agreedFareKobo: number | null }>) =>
      rows.reduce((a, r) => a + (r.agreedFareKobo ?? 0), 0);
    return {
      driving: {
        trips: asDriver.length,
        grossKobo: sum(asDriver),
        feesKobo: asDriver.reduce((a, r) => a + r.commissionKobo, 0),
        netKobo: asDriver.reduce((a, r) => a + r.driverEarningsKobo, 0),
      },
      riding: { trips: asRider.length, spentKobo: sum(asRider) },
      walletBalanceKobo: wallet?.balanceKobo ?? 0,
    };
  }
}
