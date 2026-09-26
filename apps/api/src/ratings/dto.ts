import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateRatingDto {
  @IsString()
  tripId!: string;

  @IsString()
  rateeId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comment?: string;
}
