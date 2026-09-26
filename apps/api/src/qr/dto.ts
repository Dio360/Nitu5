import { IsString, MaxLength } from "class-validator";

export class CreateQrSessionDto {
  @IsString()
  tripId!: string;
}

export class VerifyQrDto {
  /** Scanned text, e.g. N5-a1b2c3d4. */
  @IsString()
  code!: string;

  @IsString()
  bookingId!: string;
}
