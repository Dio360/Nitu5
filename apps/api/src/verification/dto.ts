import { IsIn } from "class-validator";

export class SubmitVerificationDto {
  @IsIn(["L2_IDENTITY", "L3_DRIVER_VEHICLE"])
  level!: "L2_IDENTITY" | "L3_DRIVER_VEHICLE";
}
