import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { QrService } from "./qr.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CreateQrSessionDto, VerifyQrDto } from "./dto";

@Controller("qr")
@UseGuards(JwtGuard)
export class QrController {
  constructor(private readonly qr: QrService) {}

  /** Driver shows this code at pickup. */
  @Post("session")
  session(@CurrentUser() me: AuthUser, @Body() dto: CreateQrSessionDto) {
    return this.qr.createSession(me.userId, dto.tripId);
  }

  /** Rider scans the driver's code. */
  @Post("verify")
  verify(@CurrentUser() me: AuthUser, @Body() dto: VerifyQrDto) {
    return this.qr.verify(me.userId, dto.code, dto.bookingId);
  }

  /** Driver confirms a rider face-to-face (no camera? no problem). */
  @Post("confirm/:bookingId")
  confirm(@CurrentUser() me: AuthUser, @Param("bookingId") bookingId: string) {
    return this.qr.driverConfirm(me.userId, bookingId);
  }
}
