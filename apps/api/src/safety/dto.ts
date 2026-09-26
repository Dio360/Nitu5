import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class ReportDto {
  @IsOptional()
  @IsString()
  tripId?: string;

  @IsString()
  @MaxLength(40)
  category!: string;

  @IsOptional()
  @IsIn(["low", "normal", "high", "critical"])
  severity?: "low" | "normal" | "high" | "critical";
}

export class SosDto {
  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;
}
