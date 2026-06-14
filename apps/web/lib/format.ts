import type { NodeKind, ScoreBreakdown } from "@adjacent-atlas/engine";

export interface KindVisual {
  color: string;
  label: string;
  description: string;
}

/**
 * Canonical per-kind colour and label. Server-safe (no browser APIs), so it can
 * be shared by the 3D scene, the legend, the inspector, and server pages alike.
 */
export const KIND_VISUALS: Record<NodeKind, KindVisual> = {
  concept: { color: "#5eead4", label: "Concept", description: "A diagnostic or idea." },
  method: { color: "#7aa2f7", label: "Method", description: "A technique or procedure." },
  instrument: { color: "#f5a97f", label: "Instrument", description: "A device or hardware subsystem." },
  dataset: { color: "#c3a6ff", label: "Dataset", description: "A body of observations." },
  repo: { color: "#9ece6a", label: "Implementation", description: "A public code implementation." },
  paper: { color: "#f7768e", label: "Result", description: "A published result or analysis." },
};

export const FALLBACK_KIND_VISUAL: KindVisual = {
  color: "#8b98a9",
  label: "Node",
  description: "An entity in the atlas.",
};

export function kindVisual(kind: NodeKind): KindVisual {
  return KIND_VISUALS[kind] ?? FALLBACK_KIND_VISUAL;
}

export const SUBSCORE_META: ReadonlyArray<{ key: keyof ScoreBreakdown; label: string; blurb: string }> = [
  { key: "momentum", label: "Momentum", blurb: "Recent activity growth" },
  { key: "recency", label: "Recency", blurb: "Time since last signal" },
  { key: "connectivity", label: "Connectivity", blurb: "Weighted graph degree" },
  { key: "novelty", label: "Novelty", blurb: "Inverse maturity" },
  { key: "feasibility", label: "Feasibility", blurb: "Working implementations" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatScore(adjacency: number): string {
  return adjacency.toFixed(1);
}

export function formatPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

export function formatUnit(value: number): string {
  return Math.round(value * 100).toString();
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function formatMonth(period: string): string {
  const parts = period.split("-");
  const year = parts[0] ?? "";
  const monthIndex = Number(parts[1]) - 1;
  const name = MONTHS[monthIndex] ?? parts[1] ?? "";
  return `${name} ${year}`.trim();
}
