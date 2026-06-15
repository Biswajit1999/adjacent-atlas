import { describe, expect, it } from "vitest";
import type { AtlasEdge, AtlasNode, NodeScore } from "../types/index.js";
import {
  degreeStats,
  opportunityRanking,
  scoreHistogram,
  scoreSummary,
  topTags,
} from "./metrics.js";

function node(id: string, tags: string[]): AtlasNode {
  return {
    id,
    label: id,
    kind: "concept",
    summary: "",
    tags,
    signals: { activity: [], lastActiveAt: "2026-01-01", implementations: 0, maturityYears: 1 },
  };
}

const nodes = [node("a", ["x", "y"]), node("b", ["x"]), node("c", ["z"]), node("d", [])];
const edges: AtlasEdge[] = [
  { id: "e1", source: "a", target: "b", kind: "relates", weight: 0.5 },
  { id: "e2", source: "a", target: "c", kind: "relates", weight: 0.5 },
];

function score(nodeId: string, adjacency: number, b: Partial<NodeScore["breakdown"]>): NodeScore {
  return {
    nodeId,
    adjacency,
    breakdown: { momentum: 0, recency: 0, connectivity: 0, novelty: 0, feasibility: 0, ...b },
  };
}

describe("degreeStats", () => {
  const stats = degreeStats(nodes, edges);
  it("counts nodes and edges", () => {
    expect(stats.nodeCount).toBe(4);
    expect(stats.edgeCount).toBe(2);
  });
  it("finds isolated nodes", () => {
    expect(stats.isolatedCount).toBe(1);
  });
  it("computes density over possible undirected pairs", () => {
    // 4 nodes -> 6 possible pairs; 2 edges -> 1/3
    expect(stats.density).toBeCloseTo(0.333, 2);
  });
  it("reports the maximum weighted degree", () => {
    expect(stats.maxWeightedDegree).toBeCloseTo(1.0, 6);
  });
});

describe("topTags", () => {
  it("ranks tags by frequency", () => {
    const tags = topTags(nodes);
    expect(tags[0]).toEqual({ tag: "x", count: 2 });
    expect(tags.map((t) => t.tag)).toContain("z");
  });
});

describe("scoreSummary", () => {
  it("computes min, max, mean, and median", () => {
    const s = scoreSummary([score("a", 20, {}), score("b", 40, {}), score("c", 60, {})]);
    expect(s.min).toBe(20);
    expect(s.max).toBe(60);
    expect(s.mean).toBeCloseTo(40, 6);
    expect(s.median).toBe(40);
  });
  it("handles an empty set", () => {
    expect(scoreSummary([]).count).toBe(0);
  });
});

describe("scoreHistogram", () => {
  it("bins scores and preserves the total count", () => {
    const scores = [score("a", 5, {}), score("b", 15, {}), score("c", 95, {}), score("d", 100, {})];
    const hist = scoreHistogram(scores, 10);
    expect(hist).toHaveLength(10);
    expect(hist.reduce((acc, b) => acc + b.count, 0)).toBe(4);
    // 100 must fall in the last bin, not overflow
    expect(hist[9].count).toBe(2);
  });
});

describe("opportunityRanking", () => {
  it("ranks by the forward-looking composite, not raw adjacency", () => {
    const scores = [
      score("hi-adj", 90, { momentum: 0.1, novelty: 0.1, feasibility: 0.1 }),
      score("opp", 50, { momentum: 0.9, novelty: 0.9, feasibility: 0.9 }),
    ];
    const ranked = opportunityRanking(scores, 2);
    expect(ranked[0].nodeId).toBe("opp");
    expect(ranked[0].opportunity).toBeGreaterThan(ranked[1].opportunity);
  });
});
