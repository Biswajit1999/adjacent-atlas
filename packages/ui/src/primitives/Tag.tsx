import { colors, radii, space } from "../tokens/index.js";

export type TagTone = "default" | "accent" | "warn";

export interface TagProps {
  label: string;
  tone?: TagTone;
}

const TONES: Record<TagTone, { bg: string; fg: string }> = {
  default: { bg: colors.surfaceRaised, fg: colors.muted },
  accent: { bg: colors.accentMuted, fg: colors.text },
  warn: { bg: "#5a3a2a", fg: colors.warn },
};

/** A small pill used for node kinds, tags, and status labels. */
export function Tag({ label, tone = "default" }: TagProps): JSX.Element {
  const palette = TONES[tone];
  return (
    <span
      style={{
        display: "inline-block",
        background: palette.bg,
        color: palette.fg,
        borderRadius: radii.pill,
        padding: `2px ${space.sm}px`,
        fontSize: 12,
        lineHeight: 1.6,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
