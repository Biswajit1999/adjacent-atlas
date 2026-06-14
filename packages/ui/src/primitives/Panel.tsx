import type { CSSProperties, ReactNode } from "react";
import { colors, radii, space, typography } from "../tokens/index.js";

export interface PanelProps {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}

/** A bordered surface used to group related content across the atlas UI. */
export function Panel({ title, children, style }: PanelProps): JSX.Element {
  return (
    <section
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        padding: space.lg,
        color: colors.text,
        fontFamily: typography.sans,
        ...style,
      }}
    >
      {title ? (
        <h2
          style={{
            margin: 0,
            marginBottom: space.md,
            fontSize: typography.scale.base,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
