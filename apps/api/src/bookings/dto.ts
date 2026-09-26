import { IsIn, IsInt, IsString, MaxLength, Min } from "class-validator";

export class CreateBookingDto {
  @IsString()
  tripId!: string;

  @IsInt()
  @Min(1)
  seats!: number;

  /** TOTAL for all requested seats, in kobo. */
  @IsInt()
  @Min(0)
  offeredFareKobo!: number;

  @IsString()
  @MaxLength(120)
  pickupLabel!: string;

  @IsString()
  @MaxLength(120)
  dropoffLabel!: string;

  @IsIn(["CASH", "CARD", "BANK_TRANSFER", "USSD", "WALLET"])
  paymentMethod!: "CASH" | "CARD" | "BANK_TRANSFER" | "USSD" | "WALLET";
}

export class CounterDto {
  /** Driver's counter TOTAL, in kobo. */
  @IsInt()
  @Min(0)
  amountKobo!: number;
}
