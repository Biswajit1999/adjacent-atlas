import type { ScoreBreakdown } from "../types/index.js";

/** A weight for each sub-score. Need not sum to 1; callers normalise. */
export type ScoreWeights = Record<keyof ScoreBreakdown, number>;

/**
 * Default weighting. Momentum is weighted most heavily because the atlas is
 * about what is moving *now*; novelty and feasibility act as correctives that
 * keep mature-but-busy and exciting-but-unbuildable nodes in proportion.
 */
export const DEFAULT_WEIGHTS: ScoreWeights = {
  momentum: 0.3,
  recency: 0.2,
  connectivity: 0.2,
  novelty: 0.15,
  feasibility: 0.15,
};

/**
 * Rescale weights so they sum to 1. Falls back to the defaults when the input
 * sums to a non-positive value.
 */
export function normalizeWeights(weights: ScoreWeights): ScoreWeights {
  const total =
    weights.momentum +
    weights.recency +
    weights.connectivity +
    weights.novelty +
    weights.feasibility;

  if (total <= 0) return { ...DEFAULT_WEIGHTS };

  return {
    momentum: weights.momentum / total,
    recency: weights.recency / total,
    connectivity: weights.connectivity / total,
    novelty: weights.novelty / total,
    feasibility: weights.feasibility / total,
  };
}
