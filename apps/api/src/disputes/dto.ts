import { IsOptional, IsString, MaxLength } from "class-validator";

export class OpenDisputeDto {
  @IsString()
  bookingId!: string;

  @IsString()
  @MaxLength(40)
  type!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}

export class AddEvidenceDto {
  @IsString()
  @MaxLength(1000)
  note!: string;
}
