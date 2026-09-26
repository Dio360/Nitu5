import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lastName?: string;

  /** Riders can become drivers from the app. */
  @IsOptional()
  @IsIn(["RIDER", "PRIVATE_DRIVER", "PROFESSIONAL_DRIVER"])
  role?: "RIDER" | "PRIVATE_DRIVER" | "PROFESSIONAL_DRIVER";
}
