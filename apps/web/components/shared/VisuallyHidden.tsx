import type { ReactNode } from "react";

export interface VisuallyHiddenProps {
  children: ReactNode;
}

/** Hides content visually while keeping it available to screen readers. */
export function VisuallyHidden({ children }: VisuallyHiddenProps): JSX.Element {
  return <span className="visually-hidden">{children}</span>;
}
