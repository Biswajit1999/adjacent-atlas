import type { CSSProperties } from "react";
import { colors, radii } from "../tokens/index.js";

export type BadgeTone = "neutral" | "accent" | "warn";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
}

const TONES: Record<BadgeTone, { bg: string; fg: string; dot: string }> = {
  neutral: { bg: colors.surfaceRaised, fg: colors.muted, dot: colors.muted },
  accent: { bg: "rgba(94, 234, 212, 0.12)", fg: colors.accent, dot: colors.accent },
  warn: { bg: "#3a2a1f", fg: colors.warn, dot: colors.warn },
};

export function Badge({ label, tone = "neutral", dot = false }: BadgeProps): JSX.Element {
  const palette = TONES[tone];
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: palette.bg,
    color: palette.fg,
    borderRadius: radii.pill,
    padding: "2px 10px",
    fontSize: 12,
    lineHeight: 1.6,
  };
  return (
    <span style={style}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: palette.dot }} /> : null}
      {label}
    </span>
  );
}
