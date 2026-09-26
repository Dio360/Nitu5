import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class OpenTicketDto {
  @IsOptional()
  @IsIn(["HELP", "LOST_FOUND", "PAYMENT", "SAFETY", "OTHER"])
  category?: "HELP" | "LOST_FOUND" | "PAYMENT" | "SAFETY" | "OTHER";

  @IsString()
  @MaxLength(120)
  subject!: string;

  @IsString()
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsString()
  tripId?: string;
}
