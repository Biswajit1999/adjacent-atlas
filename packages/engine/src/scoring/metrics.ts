import type { AtlasEdge, SignalPoint } from "../types/index.js";
import { clamp, logistic, sum } from "../utils/math.js";

const MS_PER_DAY = 86_400_000;

/**
 * Momentum: growth of the most recent activity window relative to the window
 * before it. The log ratio of the two windowed sums is passed through a
 * logistic so that flat activity maps to 0.5, sustained growth approaches 1,
 * and decline approaches 0. A `+1` smoothing term keeps sparse series stable.
 */
export function momentum(activity: readonly SignalPoint[], window = 3): number {
  if (activity.length === 0) return 0;

  const series = activity.map((p) => p.value);
  const recent = series.slice(-window);
  const prior = series.slice(-2 * window, -window);

  const recentSum = sum(recent);
  const priorSum = sum(prior);
  if (recentSum + priorSum === 0) return 0;

  const ratio = (recentSum + 1) / (priorSum + 1);
  return clamp(logistic(Math.log(ratio)), 0, 1);
}

/**
 * Recency: exponential decay from the last observed signal. A node active
 * `halfLifeDays` ago scores 0.5; activity today scores ~1.
 */
export function recency(lastActiveAt: string, now: Date, halfLifeDays = 180): number {
  const last = Date.parse(lastActiveAt);
  if (Number.isNaN(last)) return 0;

  const ageDays = Math.max(0, (now.getTime() - last) / MS_PER_DAY);
  return clamp(0.5 ** (ageDays / halfLifeDays), 0, 1);
}

/**
 * Connectivity: the node's total incident edge weight, normalised by the
 * largest weighted degree in the graph. Hubs approach 1; isolated nodes 0.
 */
export function connectivity(
  nodeId: string,
  edges: readonly AtlasEdge[],
  maxWeightedDegree: number,
): number {
  if (maxWeightedDegree <= 0) return 0;

  let degree = 0;
  for (const e of edges) {
    if (e.source === nodeId || e.target === nodeId) degree += e.weight;
  }
  return clamp(degree / maxWeightedDegree, 0, 1);
}

/**
 * Novelty: younger entities score higher. Maturity of `halfLifeYears` maps to
 * 0.5; a brand-new entity scores 1.
 */
export function novelty(maturityYears: number, halfLifeYears = 4): number {
  if (maturityYears <= 0) return 1;
  return clamp(0.5 ** (maturityYears / halfLifeYears), 0, 1);
}

/**
 * Feasibility: a saturating function of the number of public working
 * implementations. Zero implementations score 0; the curve approaches 1 as
 * implementations exceed `saturationAt`.
 */
export function feasibility(implementations: number, saturationAt = 5): number {
  if (implementations <= 0) return 0;
  if (saturationAt <= 0) return 1;
  return clamp(1 - Math.exp(-implementations / saturationAt), 0, 1);
}
