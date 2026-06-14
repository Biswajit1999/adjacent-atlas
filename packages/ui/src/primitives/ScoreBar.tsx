import { clamp } from "@adjacent-atlas/engine";
import { colors, radii } from "../tokens/index.js";

export interface ScoreBarProps {
  /** Score in the closed interval [0, 100]. */
  value: number;
  label?: string;
}

/** A compact horizontal meter for an adjacency or sub-score value. */
export function ScoreBar({ value, label }: ScoreBarProps): JSX.Element {
  const pct = clamp(value, 0, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {label ? (
        <span style={{ fontSize: 12, color: colors.muted, minWidth: 84 }}>{label}</span>
      ) : null}
      <div
        style={{
          flex: 1,
          height: 6,
          background: colors.surfaceRaised,
          borderRadius: radii.pill,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: colors.accent }} />
      </div>
      <span style={{ fontSize: 12, color: colors.text, minWidth: 32, textAlign: "right" }}>
        {Math.round(pct)}
      </span>
    </div>
  );
}
