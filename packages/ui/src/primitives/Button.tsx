import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { colors, radii } from "../tokens/index.js";

export type ButtonVariant = "primary" | "ghost" | "quiet";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: { background: colors.accent, color: "#08110f", border: "1px solid transparent" },
  ghost: { background: "transparent", color: colors.text, border: `1px solid ${colors.border}` },
  quiet: { background: colors.surfaceRaised, color: colors.muted, border: "1px solid transparent" },
};

export function Button({ variant = "primary", children, style, ...rest }: ButtonProps): JSX.Element {
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 38,
        padding: "0 16px",
        borderRadius: radii.sm,
        fontSize: 14,
        fontWeight: 550,
        cursor: "pointer",
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
