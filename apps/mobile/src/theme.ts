/** Nitu5 theme — Bolt-style clean look. No underscores ever reach the screen. */

export const C = {
  green: "#34BB78",
  greenDark: "#1F8A54",
  ink: "#11190C",
  grey: "#787664",
  bg: "#F3F1EE",
  card: "#FFFFFF",
  line: "#E4E1D8",
  inputLine: "#CFCFCB",
  muted: "#787664",
  yellow: "#FFC900",
  red: "#E02020",
} as const;

const TIERS: Record<string, string> = {
  L0_NONE: "Unverified",
  L1_ACCOUNT: "Account verified",
  L2_IDENTITY: "ID verified",
  L3_DRIVER_VEHICLE: "Car verified",
  L4_FULLY_VERIFIED: "Fully verified",
};

/** "BOOKING_OPEN" → "Booking open". "PRIVATE_DRIVER" → "Private driver". */
export const pretty = (v: string | undefined | null): string => {
  if (!v) return "—";
  if (TIERS[v]) return TIERS[v];
  return v
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};
