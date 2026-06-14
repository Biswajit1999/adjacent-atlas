import { describe, expect, it } from "vitest";
import { computeLayout, normalizeLayout, seedPositions } from "./layout.js";
import type { AtlasEdge, AtlasNode } from "../types/index.js";

function node(id: string): AtlasNode {
  return {
    id,
    label: id,
    kind: "concept",
    summary: "",
    tags: [],
    signals: { activity: [], lastActiveAt: "2026-01-01", implementations: 0, maturityYears: 1 },
  };
}

const nodes = ["a", "b", "c", "d"].map(node);
const edges: AtlasEdge[] = [
  { id: "e1", source: "a", target: "b", kind: "relates", weight: 0.5 },
  { id: "e2", source: "b", target: "c", kind: "relates", weight: 0.5 },
];

describe("computeLayout", () => {
  it("returns a position for every node", () => {
    const positions = computeLayout(nodes, edges, { iterations: 50 });
    expect(positions).toHaveLength(4);
    expect(new Set(positions.map((p) => p.id))).toEqual(new Set(["a", "b", "c", "d"]));
  });

  it("is deterministic for identical inputs", () => {
    const a = computeLayout(nodes, edges, { iterations: 80, seed: 7 });
    const b = computeLayout(nodes, edges, { iterations: 80, seed: 7 });
    expect(a).toEqual(b);
  });

  it("produces finite coordinates within the unit radius", () => {
    const positions = computeLayout(nodes, edges, { iterations: 80 });
    for (const p of positions) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      expect(Number.isFinite(p.z)).toBe(true);
      expect(Math.hypot(p.x, p.y, p.z)).toBeLessThanOrEqual(1 + 1e-6);
    }
  });

  it("handles empty and single-node graphs", () => {
    expect(computeLayout([], [])).toEqual([]);
    const one = computeLayout([node("solo")], []);
    expect(one).toHaveLength(1);
    expect(one[0]!.id).toBe("solo");
  });
});

describe("seedPositions", () => {
  it("is deterministic for the same seed", () => {
    expect(seedPositions(nodes, { seed: 3 })).toEqual(seedPositions(nodes, { seed: 3 }));
  });
});

describe("normalizeLayout", () => {
  it("centres and scales to unit radius", () => {
    const out = normalizeLayout([
      { id: "a", x: 10, y: 0, z: 0 },
      { id: "b", x: -10, y: 0, z: 0 },
    ]);
    const max = Math.max(...out.map((p) => Math.hypot(p.x, p.y, p.z)));
    expect(max).toBeCloseTo(1, 6);
  });
});
