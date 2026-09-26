import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { OtpService } from "./otp.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly otp: OtpService,
    private readonly jwt: JwtService,
  ) {}

  requestOtp(phone: string): void {
    this.otp.requestOtp(phone);
  }

  async verifyOtp(phone: string, code: string) {
    if (!this.otp.verifyOtp(phone, code)) {
      throw new UnauthorizedException("Wrong or expired code");
    }
    let user = await this.db.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.db.user.create({
        data: {
          phone,
          firstName: "New",
          lastName: "Rider",
          role: "RIDER",
          verificationTier: "L1_ACCOUNT",
          wallet: { create: {} },
        },
      });
    }
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, phone: user.phone, role: user.role },
      { expiresIn: "15m" },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: "refresh" },
      { expiresIn: "30d" },
    );
    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; type: string }>(refreshToken);
      if (payload.type !== "refresh") throw new Error("not a refresh token");
      const user = await this.db.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new Error("user gone");
      const accessToken = await this.jwt.signAsync(
        { sub: user.id, phone: user.phone, role: user.role },
        { expiresIn: "15m" },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException("Bad refresh token — log in again");
    }
  }
}
