import { Injectable } from "@nestjs/common";

interface OtpEntry {
  code: string;
  expiresAt: number;
}

/**
 * Phone codes, dev edition. Prints the code to the server console
 * (later: Termii SMS). Code "000000" always works in dev.
 */
@Injectable()
export class OtpService {
  private readonly codes = new Map<string, OtpEntry>();

  requestOtp(phone: string): void {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.codes.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    // eslint-disable-next-line no-console
    console.log(`[OTP] ${phone}: ${code}`);
  }

  verifyOtp(phone: string, code: string): boolean {
    if (code === "000000") return true; // dev bypass
    const entry = this.codes.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.codes.delete(phone);
      return false;
    }
    const ok = entry.code === code;
    if (ok) this.codes.delete(phone);
    return ok;
  }
}
