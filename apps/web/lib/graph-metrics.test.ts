import { describe, expect, it } from "vitest";
import type { AtlasSnapshot } from "@adjacent-atlas/engine";
import { activityTimeline, computeStats, opportunities, searchNodes } from "./graph-metrics";

function snap(): AtlasSnapshot {
  return {
    meta: {
      id: "test",
      generatedAt: "2026-06-14T00:00:00.000Z",
      domain: "test",
      sourceWindow: { from: "2025-01-01", to: "2026-02-28" },
      nodeCount: 3,
      edgeCount: 1,
      engineVersion: "0.1.0",
    },
    nodes: [
      {
        id: "comb",
        label: "Laser Frequency Comb",
        kind: "instrument",
        summary: "",
        tags: ["calibration", "photonics"],
        signals: {
          activity: [
            { period: "2025-01", value: 2 },
            { period: "2025-02", value: 3 },
          ],
          lastActiveAt: "2026-02-01",
          implementations: 4,
          maturityYears: 12,
        },
      },
      {
        id: "activity",
        label: "Stellar Activity Mitigation",
        kind: "method",
        summary: "",
        tags: ["calibration", "stellar-jitter"],
        signals: {
          activity: [
            { period: "2025-01", value: 5 },
            { period: "2025-02", value: 1 },
          ],
          lastActiveAt: "2026-02-01",
          implementations: 1,
          maturityYears: 3,
        },
      },
      {
        id: "lonely",
        label: "Telluric Correction",
        kind: "method",
        summary: "",
        tags: ["atmosphere"],
        signals: { activity: [], lastActiveAt: "2024-01-01", implementations: 0, maturityYears: 9 },
      },
    ],
    edges: [{ id: "e1", source: "comb", target: "activity", kind: "relates", weight: 0.5 }],
    scores: [
      { nodeId: "comb", adjacency: 70, breakdown: { momentum: 0.6, recency: 0.9, connectivity: 1, novelty: 0.4, feasibility: 0.7 } },
      { nodeId: "activity", adjacency: 55, breakdown: { momentum: 0.9, recency: 0.9, connectivity: 1, novelty: 0.9, feasibility: 0.4 } },
      { nodeId: "lonely", adjacency: 20, breakdown: { momentum: 0.2, recency: 0.1, connectivity: 0, novelty: 0.3, feasibility: 0 } },
    ],
  };
}

describe("computeStats", () => {
  const stats = computeStats(snap());
  it("counts nodes, edges, and isolated nodes", () => {
    expect(stats.nodeCount).toBe(3);
    expect(stats.edgeCount).toBe(1);
    expect(stats.isolatedCount).toBe(1);
  });
  it("ranks the shared tag first", () => {
    expect(stats.topTags[0]).toEqual({ tag: "calibration", count: 2 });
  });
  it("summarises the score distribution", () => {
    expect(stats.score.max).toBe(70);
    expect(stats.score.min).toBe(20);
    expect(stats.histogram.reduce((a, b) => a + b.count, 0)).toBe(3);
  });
});

describe("opportunities", () => {
  it("ranks the high momentum/novelty node above the higher-adjacency one", () => {
    const rows = opportunities(snap(), 3);
    expect(rows[0].nodeId).toBe("activity");
    expect(rows[0].label).toBe("Stellar Activity Mitigation");
  });
});

describe("activityTimeline", () => {
  it("aggregates activity across nodes by period", () => {
    const points = activityTimeline(snap().nodes);
    expect(points).toEqual([
      { period: "2025-01", value: 7 },
      { period: "2025-02", value: 4 },
    ]);
  });
});

describe("searchNodes", () => {
  const nodes = snap().nodes;
  it("returns null for an empty query", () => {
    expect(searchNodes(nodes, "  ")).toBeNull();
  });
  it("matches label, id, and tag, case-insensitively", () => {
    expect(searchNodes(nodes, "comb")).toEqual(new Set(["comb"]));
    expect(searchNodes(nodes, "CALIBRATION")).toEqual(new Set(["comb", "activity"]));
    expect(searchNodes(nodes, "telluric")).toEqual(new Set(["lonely"]));
  });
});
