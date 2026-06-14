import { describe, expect, it } from "vitest";
import type { AtlasEdge, AtlasNode } from "../types/index.js";
import { maxWeightedDegree, scoreNode, scoreSnapshot } from "./score.js";

const NOW = new Date("2026-03-01T00:00:00.000Z");

const hot: AtlasNode = {
  id: "hot",
  label: "Hot",
  kind: "method",
  summary: "Recent, accelerating, well connected, young.",
  tags: [],
  signals: {
    activity: [
      { period: "2025-10", value: 2 },
      { period: "2025-11", value: 3 },
      { period: "2025-12", value: 4 },
      { period: "2026-01", value: 8 },
      { period: "2026-02", value: 12 },
    ],
    lastActiveAt: "2026-02-25",
    implementations: 6,
    maturityYears: 2,
  },
};

const cold: AtlasNode = {
  id: "cold",
  label: "Cold",
  kind: "method",
  summary: "Stale, declining, isolated, mature.",
  tags: [],
  signals: {
    activity: [
      { period: "2024-01", value: 9 },
      { period: "2024-02", value: 6 },
      { period: "2024-03", value: 3 },
      { period: "2024-04", value: 2 },
      { period: "2024-05", value: 1 },
    ],
    lastActiveAt: "2024-05-10",
    implementations: 0,
    maturityYears: 20,
  },
};

const edges: AtlasEdge[] = [
  { id: "e1", source: "hot", target: "cold", kind: "relates", weight: 0.9 },
];

describe("maxWeightedDegree", () => {
  it("returns 0 for an edgeless graph", () => {
    expect(maxWeightedDegree([hot, cold], [])).toBe(0);
  });

  it("returns the largest incident weight", () => {
    expect(maxWeightedDegree([hot, cold], edges)).toBeCloseTo(0.9, 6);
  });
});

describe("scoreSnapshot", () => {
  const scores = scoreSnapshot([hot, cold], edges, { now: NOW });

  it("produces one score per node", () => {
    expect(scores).toHaveLength(2);
  });

  it("keeps adjacency within [0, 100] and sub-scores within [0, 1]", () => {
    for (const s of scores) {
      expect(s.adjacency).toBeGreaterThanOrEqual(0);
      expect(s.adjacency).toBeLessThanOrEqual(100);
      for (const value of Object.values(s.breakdown)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it("ranks the hot node above the cold node", () => {
    const byId = new Map(scores.map((s) => [s.nodeId, s.adjacency]));
    expect(byId.get("hot")!).toBeGreaterThan(byId.get("cold")!);
  });
});

describe("scoreNode", () => {
  it("is deterministic for a fixed reference time", () => {
    const maxDegree = maxWeightedDegree([hot, cold], edges);
    const a = scoreNode(hot, edges, maxDegree, { now: NOW });
    const b = scoreNode(hot, edges, maxDegree, { now: NOW });
    expect(a).toEqual(b);
  });
});
