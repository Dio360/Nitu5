import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateTripDto {
  @IsIn(["SHARED", "PRIVATE"])
  rideModel!: "SHARED" | "PRIVATE";

  @IsIn(["SCHEDULED", "LEAVING_SOON", "INSTANT"])
  tripType!: "SCHEDULED" | "LEAVING_SOON" | "INSTANT";

  @IsString()
  @MaxLength(120)
  originLabel!: string;

  @IsString()
  @MaxLength(120)
  destinationLabel!: string;

  @IsDateString()
  departureAt!: string;

  @IsInt()
  @Min(1)
  seatsTotal!: number;

  /** Required for SHARED (price per seat, in kobo). */
  @IsOptional()
  @IsInt()
  @Min(0)
  farePerSeatKobo?: number;

  /** Required for PRIVATE (whole-car price, in kobo). */
  @IsOptional()
  @IsInt()
  @Min(0)
  privateFareKobo?: number;
}

export class SearchTripsDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}
