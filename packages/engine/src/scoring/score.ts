import type {
  AtlasEdge,
  AtlasNode,
  NodeScore,
  ScoreBreakdown,
} from "../types/index.js";
import { round, weightedMean } from "../utils/math.js";
import {
  connectivity,
  feasibility,
  momentum,
  novelty,
  recency,
} from "./metrics.js";
import { DEFAULT_WEIGHTS, normalizeWeights, type ScoreWeights } from "./weights.js";

/** Tunable parameters for a scoring pass. All fields are optional. */
export interface ScoreOptions {
  /** Reference time for recency decay. Defaults to `new Date()`. */
  now?: Date;
  /** Sub-score weights. Defaults to {@link DEFAULT_WEIGHTS}. */
  weights?: ScoreWeights;
  /** Window length, in months, for the momentum calculation. */
  momentumWindow?: number;
  /** Half-life, in days, for recency decay. */
  recencyHalfLifeDays?: number;
  /** Half-life, in years, for novelty decay. */
  noveltyHalfLifeYears?: number;
  /** Implementation count at which feasibility saturates. */
  feasibilitySaturation?: number;
}

/**
 * The largest total incident edge weight across all nodes. Used to normalise
 * connectivity. Returns `0` for an edgeless graph.
 */
export function maxWeightedDegree(
  nodes: readonly AtlasNode[],
  edges: readonly AtlasEdge[],
): number {
  const degree = new Map<string, number>();
  for (const node of nodes) degree.set(node.id, 0);

  for (const e of edges) {
    if (degree.has(e.source)) degree.set(e.source, (degree.get(e.source) ?? 0) + e.weight);
    if (degree.has(e.target)) degree.set(e.target, (degree.get(e.target) ?? 0) + e.weight);
  }

  let max = 0;
  for (const value of degree.values()) {
    if (value > max) max = value;
  }
  return max;
}

/** Score a single node against a precomputed `maxDegree`. */
export function scoreNode(
  node: AtlasNode,
  edges: readonly AtlasEdge[],
  maxDegree: number,
  options: ScoreOptions = {},
): NodeScore {
  const now = options.now ?? new Date();
  const weights = normalizeWeights(options.weights ?? DEFAULT_WEIGHTS);

  const breakdown: ScoreBreakdown = {
    momentum: momentum(node.signals.activity, options.momentumWindow),
    recency: recency(node.signals.lastActiveAt, now, options.recencyHalfLifeDays),
    connectivity: connectivity(node.id, edges, maxDegree),
    novelty: novelty(node.signals.maturityYears, options.noveltyHalfLifeYears),
    feasibility: feasibility(node.signals.implementations, options.feasibilitySaturation),
  };

  const composite = weightedMean(
    breakdown as unknown as Record<string, number>,
    weights as unknown as Record<string, number>,
  );

  return {
    nodeId: node.id,
    adjacency: round(composite * 100, 1),
    breakdown,
  };
}

/** Score every node in a graph. Computes `maxDegree` once and reuses it. */
export function scoreSnapshot(
  nodes: readonly AtlasNode[],
  edges: readonly AtlasEdge[],
  options: ScoreOptions = {},
): NodeScore[] {
  const maxDegree = maxWeightedDegree(nodes, edges);
  return nodes.map((node) => scoreNode(node, edges, maxDegree, options));
}
