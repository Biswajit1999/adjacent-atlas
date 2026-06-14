import { describe, expect, it } from "vitest";
import type { AtlasEdge, SignalPoint } from "../types/index.js";
import { connectivity, feasibility, momentum, novelty, recency } from "./metrics.js";

const MS_PER_DAY = 86_400_000;

function series(values: number[]): SignalPoint[] {
  return values.map((value, i) => ({
    period: `2025-${String(i + 1).padStart(2, "0")}`,
    value,
  }));
}

describe("momentum", () => {
  it("returns 0 for an empty series", () => {
    expect(momentum([])).toBe(0);
  });

  it("returns 0.5 for flat activity", () => {
    expect(momentum(series([3, 3, 3, 3, 3, 3]))).toBeCloseTo(0.5, 6);
  });

  it("exceeds 0.5 when recent activity outpaces the prior window", () => {
    expect(momentum(series([1, 1, 1, 5, 6, 7]))).toBeGreaterThan(0.6);
  });

  it("falls below 0.5 when activity is declining", () => {
    expect(momentum(series([7, 6, 5, 1, 1, 1]))).toBeLessThan(0.4);
  });
});

describe("recency", () => {
  const now = new Date("2026-03-01T00:00:00.000Z");

  it("scores ~1 for activity dated now", () => {
    expect(recency(now.toISOString(), now)).toBeCloseTo(1, 6);
  });

  it("scores 0.5 at one half-life of age", () => {
    const last = new Date(now.getTime() - 180 * MS_PER_DAY).toISOString();
    expect(recency(last, now, 180)).toBeCloseTo(0.5, 4);
  });

  it("returns 0 for an unparseable date", () => {
    expect(recency("not-a-date", now)).toBe(0);
  });
});

describe("connectivity", () => {
  const edges: AtlasEdge[] = [
    { id: "e1", source: "a", target: "b", kind: "relates", weight: 0.5 },
    { id: "e2", source: "a", target: "c", kind: "relates", weight: 0.5 },
  ];

  it("returns 0 when the graph has no weighted degree", () => {
    expect(connectivity("a", [], 0)).toBe(0);
  });

  it("returns 1 for the most connected node", () => {
    expect(connectivity("a", edges, 1)).toBe(1);
  });

  it("scales linearly below the maximum", () => {
    expect(connectivity("b", edges, 1)).toBeCloseTo(0.5, 6);
  });
});

describe("novelty", () => {
  it("scores 1 for a brand-new entity", () => {
    expect(novelty(0)).toBe(1);
  });

  it("scores 0.5 at one half-life of maturity", () => {
    expect(novelty(4, 4)).toBeCloseTo(0.5, 6);
  });
});

describe("feasibility", () => {
  it("returns 0 with no implementations", () => {
    expect(feasibility(0)).toBe(0);
  });

  it("returns 1 - 1/e at the saturation point", () => {
    expect(feasibility(5, 5)).toBeCloseTo(1 - Math.exp(-1), 6);
  });

  it("approaches 1 for many implementations", () => {
    expect(feasibility(100, 5)).toBeGreaterThan(0.99);
  });
});
