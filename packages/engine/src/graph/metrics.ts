/**
 * Descriptive metrics over a scored graph: degree/density statistics, tag
 * frequencies, score distribution, and an "opportunity" ranking that weights
 * the forward-looking components (momentum, novelty, feasibility).
 *
 * Pure and dependency-free apart from the graph helper and the rounding util.
 */
import type { AtlasEdge, AtlasNode, NodeScore, ScoreBreakdown } from "../types/index.js";
import { round } from "../utils/math.js";
import { buildGraph } from "./graph.js";

export interface DegreeStats {
  nodeCount: number;
  edgeCount: number;
  /** Largest total incident edge weight across nodes. */
  maxWeightedDegree: number;
  /** Mean number of incident edges per node. */
  meanDegree: number;
  /** Count of nodes with no edges. */
  isolatedCount: number;
  /** Edges divided by the number of possible undirected pairs, in [0, 1]. */
  density: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface ScoreSummary {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
}

export interface HistogramBin {
  from: number;
  to: number;
  count: number;
}

export interface OpportunityEntry {
  nodeId: string;
  /** Forward-looking composite in [0, 1]. */
  opportunity: number;
  momentum: number;
  novelty: number;
  feasibility: number;
  adjacency: number;
}

export function degreeStats(nodes: readonly AtlasNode[], edges: readonly AtlasEdge[]): DegreeStats {
  const graph = buildGraph(nodes, edges);
  const n = nodes.length;

  let maxWeighted = 0;
  let degreeSum = 0;
  let isolated = 0;
  for (const node of nodes) {
    const degree = graph.degree(node.id);
    degreeSum += degree;
    if (degree === 0) isolated += 1;
    const weighted = graph.weightedDegree(node.id);
    if (weighted > maxWeighted) maxWeighted = weighted;
  }

  const possiblePairs = n > 1 ? (n * (n - 1)) / 2 : 0;
  const density = possiblePairs > 0 ? edges.length / possiblePairs : 0;

  return {
    nodeCount: n,
    edgeCount: edges.length,
    maxWeightedDegree: round(maxWeighted, 3),
    meanDegree: n > 0 ? round(degreeSum / n, 3) : 0,
    isolatedCount: isolated,
    density: round(density, 3),
  };
}

export function topTags(nodes: readonly AtlasNode[], limit = 8): TagCount[] {
  const counts = new Map<string, number>();
  for (const node of nodes) {
    for (const tag of node.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(0, limit));
}

export function scoreSummary(scores: readonly NodeScore[]): ScoreSummary {
  if (scores.length === 0) return { count: 0, min: 0, max: 0, mean: 0, median: 0 };

  const values = scores.map((s) => s.adjacency).sort((a, b) => a - b);
  const total = values.reduce((acc, v) => acc + v, 0);
  const mid = Math.floor(values.length / 2);
  const median = values.length % 2 === 1 ? values[mid] : (values[mid - 1] + values[mid]) / 2;

  return {
    count: values.length,
    min: round(values[0], 1),
    max: round(values[values.length - 1], 1),
    mean: round(total / values.length, 1),
    median: round(median, 1),
  };
}

export function scoreHistogram(scores: readonly NodeScore[], bins = 10): HistogramBin[] {
  const binCount = Math.max(1, bins);
  const width = 100 / binCount;
  const out: HistogramBin[] = Array.from({ length: binCount }, (_, i) => ({
    from: round(i * width, 2),
    to: round((i + 1) * width, 2),
    count: 0,
  }));

  for (const score of scores) {
    let idx = Math.floor(score.adjacency / width);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    out[idx].count += 1;
  }
  return out;
}

/** Weights for the forward-looking "opportunity" lens. */
export const OPPORTUNITY_WEIGHTS: Pick<ScoreBreakdown, "momentum" | "novelty" | "feasibility"> = {
  momentum: 0.4,
  novelty: 0.35,
  feasibility: 0.25,
};

export function opportunityScore(breakdown: ScoreBreakdown): number {
  return (
    breakdown.momentum * OPPORTUNITY_WEIGHTS.momentum +
    breakdown.novelty * OPPORTUNITY_WEIGHTS.novelty +
    breakdown.feasibility * OPPORTUNITY_WEIGHTS.feasibility
  );
}

export function opportunityRanking(scores: readonly NodeScore[], limit = 5): OpportunityEntry[] {
  return scores
    .map((s) => ({
      nodeId: s.nodeId,
      opportunity: round(opportunityScore(s.breakdown), 3),
      momentum: s.breakdown.momentum,
      novelty: s.breakdown.novelty,
      feasibility: s.breakdown.feasibility,
      adjacency: s.adjacency,
    }))
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, Math.max(0, limit));
}
