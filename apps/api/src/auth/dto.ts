import { IsPhoneNumber, IsString, Length } from "class-validator";

export class RequestOtpDto {
  @IsString()
  phone!: string;
}

export class VerifyOtpDto {
  @IsString()
  phone!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class PhoneDto {
  @IsPhoneNumber()
  _unused?: never;
}
