import { describe, expect, it } from "vitest";
import { DEFAULT_WEIGHTS, normalizeWeights } from "./weights.js";

describe("normalizeWeights", () => {
  it("rescales equal weights to sum to 1", () => {
    const w = normalizeWeights({ momentum: 2, recency: 2, connectivity: 2, novelty: 2, feasibility: 2 });
    const sum = w.momentum + w.recency + w.connectivity + w.novelty + w.feasibility;
    expect(sum).toBeCloseTo(1, 6);
    expect(w.momentum).toBeCloseTo(0.2, 6);
  });

  it("keeps the default weights summing to 1 and momentum dominant", () => {
    const w = normalizeWeights(DEFAULT_WEIGHTS);
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 6);
    expect(w.momentum).toBeGreaterThan(w.novelty);
  });

  it("falls back to the defaults on a non-positive total", () => {
    const w = normalizeWeights({ momentum: 0, recency: 0, connectivity: 0, novelty: 0, feasibility: 0 });
    expect(w).toEqual(DEFAULT_WEIGHTS);
  });
});
