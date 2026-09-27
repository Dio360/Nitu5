import { IsIn, IsOptional, IsString } from "class-validator";

export class DecideDisputeDto {
  @IsString()
  decision!: string;

  @IsIn(["DECIDED", "CLOSED"])
  status!: "DECIDED" | "CLOSED";
}

export class SafetyStatusDto {
  @IsIn(["OPEN", "REVIEWING", "RESOLVED", "DISMISSED"])
  status!: "OPEN" | "REVIEWING" | "RESOLVED" | "DISMISSED";
}

export class TicketStatusDto {
  @IsIn(["OPEN", "IN_PROGRESS", "RESOLVED"])
  status!: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export class UpdateUserDto {
  @IsOptional()
  @IsIn(["RIDER", "PRIVATE_DRIVER", "PROFESSIONAL_DRIVER", "ADMIN", "SUPPORT"])
  role?: "RIDER" | "PRIVATE_DRIVER" | "PROFESSIONAL_DRIVER" | "ADMIN" | "SUPPORT";

  @IsOptional()
  @IsIn(["L0_NONE", "L1_ACCOUNT", "L2_IDENTITY", "L3_DRIVER_VEHICLE", "L4_FULLY_VERIFIED"])
  verificationTier?: "L0_NONE" | "L1_ACCOUNT" | "L2_IDENTITY" | "L3_DRIVER_VEHICLE" | "L4_FULLY_VERIFIED";
}

export class VerifyVehicleDto {
  @IsIn(["VERIFIED", "REJECTED"])
  status!: "VERIFIED" | "REJECTED";
}
