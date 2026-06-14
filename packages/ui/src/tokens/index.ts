/**
 * Design tokens for Adjacent Atlas. These are the canonical values; the prose
 * specs under `design/tokens` describe intent, and this file is what code
 * imports. Colours target a dark, instrument-panel aesthetic.
 */

export const colors = {
  bg: "#0b0f14",
  surface: "#121822",
  surfaceRaised: "#19212d",
  border: "#1f2a37",
  text: "#e6edf3",
  muted: "#8b98a9",
  accent: "#5eead4",
  accentMuted: "#2c7a73",
  warn: "#f5a97f",
  danger: "#ed8796",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  sans: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
  scale: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
} as const;

export const motion = {
  fast: "120ms",
  base: "220ms",
  slow: "480ms",
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export type Colors = typeof colors;
export type Space = typeof space;
export type Typography = typeof typography;
