import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RefreshDto, RequestOtpDto, VerifyOtpDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("otp/request")
  request(@Body() dto: RequestOtpDto): { sent: boolean } {
    this.auth.requestOtp(dto.phone);
    return { sent: true };
  }

  @Post("otp/verify")
  verify(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.code);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }
}
