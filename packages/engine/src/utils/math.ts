/**
 * Small, dependency-free numeric helpers used by the scoring module.
 * Every function is pure and total over finite inputs.
 */

/** Constrain `value` to the inclusive range [`lo`, `hi`]. */
export function clamp(value: number, lo: number, hi: number): number {
  if (value < lo) return lo;
  if (value > hi) return hi;
  return value;
}

/** Sum of a numeric array; `0` for the empty array. */
export function sum(values: readonly number[]): number {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Arithmetic mean; `0` for the empty array. */
export function mean(values: readonly number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}

/** Standard logistic (sigmoid) function. */
export function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Min-max normalisation into [0, 1]. Returns `0` when the range is empty
 * (`max <= min`) so degenerate inputs never produce NaN.
 */
export function normalizeMinMax(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/** Round to a fixed number of decimal places. */
export function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Weighted mean over the keys present in `weights`. Missing values are treated
 * as `0`. Returns `0` when the weights sum to `0`.
 */
export function weightedMean(
  values: Record<string, number>,
  weights: Record<string, number>,
): number {
  let numerator = 0;
  let denominator = 0;
  for (const key of Object.keys(weights)) {
    const w = weights[key] ?? 0;
    const v = values[key] ?? 0;
    numerator += w * v;
    denominator += w;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}
