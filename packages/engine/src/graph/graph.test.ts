import { describe, expect, it } from "vitest";
import { buildGraph, validateEdges } from "./graph.js";
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

const nodes = [node("a"), node("b"), node("c")];
const edges: AtlasEdge[] = [
  { id: "e1", source: "a", target: "b", kind: "relates", weight: 0.4 },
  { id: "e2", source: "a", target: "c", kind: "depends", weight: 0.6 },
];

describe("AtlasGraph", () => {
  const graph = buildGraph(nodes, edges);

  it("reports neighbour degree", () => {
    expect(graph.degree("a")).toBe(2);
    expect(graph.degree("b")).toBe(1);
  });

  it("sums weighted degree", () => {
    expect(graph.weightedDegree("a")).toBeCloseTo(1.0, 6);
    expect(graph.weightedDegree("c")).toBeCloseTo(0.6, 6);
  });

  it("finds isolated nodes", () => {
    const withIsolate = buildGraph([...nodes, node("x")], edges);
    expect(withIsolate.isolated().map((n) => n.id)).toContain("x");
  });
});

describe("validateEdges", () => {
  it("passes a clean graph", () => {
    expect(validateEdges(nodes, edges)).toEqual([]);
  });

  it("flags unknown endpoints, duplicates, and self-loops", () => {
    const bad: AtlasEdge[] = [
      { id: "e1", source: "a", target: "z", kind: "relates", weight: 0.5 },
      { id: "e1", source: "a", target: "a", kind: "relates", weight: 0.5 },
    ];
    const problems = validateEdges(nodes, bad);
    expect(problems.some((p) => p.includes("unknown target"))).toBe(true);
    expect(problems.some((p) => p.includes("duplicate"))).toBe(true);
    expect(problems.some((p) => p.includes("self-loop"))).toBe(true);
  });
});
