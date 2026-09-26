import { IsIn, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class SearchTripsDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  from?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  to?: string;

  /** Day of travel, e.g. 2026-10-01. */
  @IsOptional()
  @IsString()
  date?: string;

  /** Seats the rider needs. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  seats?: number;

  @IsOptional()
  @IsIn(["SHARED", "PRIVATE"])
  rideModel?: "SHARED" | "PRIVATE";

  @IsOptional()
  @IsIn(["SCHEDULED", "LEAVING_SOON", "INSTANT"])
  tripType?: "SCHEDULED" | "LEAVING_SOON" | "INSTANT";

  /** Map search: point + radius. Trips are ranked nearest-first. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fromLat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fromLng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusKm?: number;
}
