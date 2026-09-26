/**
 * Nitu5 domain v0.1 — core marketplace types + pure rules.
 * Mirrors docs/IMPLEMENTATION_PLAN.md §2. No I/O, no dependencies.
 */

export type Role = "RIDER" | "PRIVATE_DRIVER" | "PROFESSIONAL_DRIVER" | "ADMIN" | "SUPPORT";

export type DriverType = "PRIVATE" | "PROFESSIONAL";

export type VerificationTier = "L0_NONE" | "L1_ACCOUNT" | "L2_IDENTITY" | "L3_DRIVER_VEHICLE" | "L4_FULLY_VERIFIED";

export type RideModel = "SHARED" | "PRIVATE";

export type TripType = "SCHEDULED" | "LEAVING_SOON" | "INSTANT";

export type TripStatus =
  | "PUBLISHED"
  | "SEARCHING"
  | "BOOKING_OPEN"
  | "CONFIRMED"
  | "NEARLY_FULL"
  | "FULL"
  | "DRIVER_ARRIVING"
  | "QR_VERIFIED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BookingStatus =
  | "OFFERED"
  | "COUNTERED"
  | "CONFIRMED"
  | "QR_VERIFIED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type OfferAction = "OFFER" | "COUNTER" | "ACCEPT" | "DECLINE";

export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "USSD" | "WALLET";

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "CAPTURED" | "HELD" | "REFUNDED" | "CASH_RECORDED";

export interface Money {
  /** Amount in kobo (integer — never floats for money). */
  kobo: number;
}

export const naira = (n: number): Money => ({ kobo: Math.round(n * 100) });

export const moneyToNaira = (m: Money): string => `₦${(m.kobo / 100).toLocaleString("en-NG")}`;

export interface FareRange {
  min: Money;
  max: Money;
}

export interface Trip {
  id: string;
  driverId: string;
  rideModel: RideModel;
  tripType: TripType;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  seatsTotal: number;
  seatsBooked: number;
  /** Shared rides: price per seat. */
  farePerSeat: Money | null;
  /** Private rides: whole-vehicle price. */
  privateFare: Money | null;
  status: TripStatus;
}

export interface Booking {
  id: string;
  tripId: string;
  riderId: string;
  seats: number;
  offeredFare: Money;
  agreedFare: Money | null;
  commission: Money;
  driverEarnings: Money;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
}

export const seatsAvailable = (trip: Trip): number => Math.max(0, trip.seatsTotal - trip.seatsBooked);

/** PRD §10 — booked seats are reserved; never oversell. */
export const canBookSeats = (trip: Trip, seats: number): boolean =>
  seats > 0 && Number.isInteger(seats) && seatsAvailable(trip) >= seats;

/**
 * PRD §31–32 — commission split + driver earnings transparency.
 * @param commissionRate e.g. 0.1 for shared (lower), 0.15 for private (standard)
 */
export const computeEarnings = (
  agreedFareKobo: number,
  commissionRate: number,
): { fare: Money; fee: Money; driverEarnings: Money } => {
  const fee = Math.round(agreedFareKobo * commissionRate);
  return {
    fare: { kobo: agreedFareKobo },
    fee: { kobo: fee },
    driverEarnings: { kobo: agreedFareKobo - fee },
  };
};

/** Shared rides pay per seat; whole-vehicle price for private (PRD §8–9). */
export const quoteTrip = (trip: Trip, seats: number): Money | null => {
  if (trip.rideModel === "SHARED") {
    if (!trip.farePerSeat) return null;
    return { kobo: trip.farePerSeat.kobo * seats };
  }
  return trip.privateFare;
};
