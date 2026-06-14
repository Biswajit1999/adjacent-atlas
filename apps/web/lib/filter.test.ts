import { describe, expect, it } from "vitest";
import type { AtlasSnapshot } from "@adjacent-atlas/engine";
import { applyFilter, collectKinds, collectTags, matchesFilter, rankEntries } from "./filter";

const snapshot: AtlasSnapshot = {
  meta: {
    id: "test",
    generatedAt: "2026-06-14T00:00:00.000Z",
    domain: "test",
    sourceWindow: { from: "2026-01-01", to: "2026-06-01" },
    nodeCount: 3,
    edgeCount: 0,
    engineVersion: "0.1.0",
  },
  nodes: [
    { id: "a", label: "A", kind: "method", summary: "", tags: ["x"], signals: { activity: [], lastActiveAt: "2026-01-01", implementations: 0, maturityYears: 1 } },
    { id: "b", label: "B", kind: "instrument", summary: "", tags: ["y"], signals: { activity: [], lastActiveAt: "2026-01-01", implementations: 0, maturityYears: 1 } },
    { id: "c", label: "C", kind: "method", summary: "", tags: ["x", "z"], signals: { activity: [], lastActiveAt: "2026-01-01", implementations: 0, maturityYears: 1 } },
  ],
  edges: [],
  scores: [
    { nodeId: "a", adjacency: 80, breakdown: { momentum: 0.8, recency: 0.8, connectivity: 0.8, novelty: 0.8, feasibility: 0.8 } },
    { nodeId: "b", adjacency: 40, breakdown: { momentum: 0.4, recency: 0.4, connectivity: 0.4, novelty: 0.4, feasibility: 0.4 } },
    { nodeId: "c", adjacency: 60, breakdown: { momentum: 0.6, recency: 0.6, connectivity: 0.6, novelty: 0.6, feasibility: 0.6 } },
  ],
};

describe("rankEntries", () => {
  it("orders nodes by adjacency, descending", () => {
    const entries = rankEntries(snapshot);
    expect(entries.map((e) => e.node.id)).toEqual(["a", "c", "b"]);
  });
});

describe("collectKinds / collectTags", () => {
  it("collects unique kinds and sorted tags", () => {
    expect(new Set(collectKinds(snapshot.nodes))).toEqual(new Set(["method", "instrument"]));
    expect(collectTags(snapshot.nodes)).toEqual(["x", "y", "z"]);
  });
});

describe("applyFilter", () => {
  const entries = rankEntries(snapshot);

  it("filters by kind", () => {
    const out = applyFilter(entries, { kinds: ["method"], minScore: 0, tag: null });
    expect(out.map((e) => e.node.id)).toEqual(["a", "c"]);
  });

  it("filters by minimum score", () => {
    const out = applyFilter(entries, { kinds: [], minScore: 70, tag: null });
    expect(out.map((e) => e.node.id)).toEqual(["a"]);
  });

  it("filters by tag", () => {
    const out = applyFilter(entries, { kinds: [], minScore: 0, tag: "z" });
    expect(out.map((e) => e.node.id)).toEqual(["c"]);
  });

  it("matchesFilter combines criteria", () => {
    const entry = entries[0]!;
    expect(matchesFilter(entry, { kinds: ["method"], minScore: 75, tag: "x" })).toBe(true);
    expect(matchesFilter(entry, { kinds: ["instrument"], minScore: 0, tag: null })).toBe(false);
  });
});
