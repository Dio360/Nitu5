/**
 * Nitu5 Design Tokens v0.3
 * Bold-outline style, Nitu-blue-led palette. Single source of truth —
 * keep in sync with docs/design-system-preview.html
 */
export const colors = {
  nituBlue: "#0D60D8",
  nituBlueDark: "#0A4CB0",
  deepNavy: "#062863",
  popPink: "#FF90E8",
  sunYellow: "#FFC900",
  mint: "#B8F1CC",
  cream: "#FFF9EF",
  skyTint: "#E7F0FE",
  ink: "#000000",
  muted: "#5A6B87",
  sosRed: "#E02020",
} as const;

export type ColorName = keyof typeof colors;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const borders = {
  brutal: 2,
} as const;

export const shadows = {
  /** hard offset shadow, e.g. `5px 5px 0 #000` (web) */
  brutal: { offsetX: 5, offsetY: 5, color: colors.ink },
  brutalSm: { offsetX: 3, offsetY: 3, color: colors.ink },
} as const;

export const font = {
  family: "Inter, 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
} as const;
