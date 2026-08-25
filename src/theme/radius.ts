// Border Radius Design Tokens
export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 28,
  pill: 999,
  round: 9999,
} as const;

export type Radius = typeof radius;
