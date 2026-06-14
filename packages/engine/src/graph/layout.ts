import type { AtlasEdge, AtlasNode } from "../types/index.js";

/** A node position in normalised layout space (unit-radius after normalisation). */
export interface LayoutPosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface LayoutOptions {
  iterations?: number;
  dimensions?: 2 | 3;
  /** Linear extent of the layout volume before normalisation. */
  area?: number;
  /** Strength of the pull toward the origin. */
  gravity?: number;
  /** Salt for the deterministic jitter, so callers can request variants. */
  seed?: number;
  /** Optional adjacency scores (0..100) used to pull strong nodes inward. */
  scores?: Record<string, number>;
}

export type LayoutIterationCallback = (positions: LayoutPosition[], iteration: number) => void;

const DEFAULTS = {
  iterations: 240,
  dimensions: 3 as 2 | 3,
  area: 100,
  gravity: 0.08,
  seed: 1,
};

/** Deterministic hash → pseudo-random number in [0, 1). FNV-1a with a finaliser. */
function hash01(input: string, salt: number): number {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

export interface SeedOptions {
  dimensions?: 2 | 3;
  area?: number;
  seed?: number;
}

/**
 * Deterministic initial placement. In 3D, points are spread on a Fibonacci
 * sphere (even angular coverage, no clustering at the poles); in 2D, on a
 * golden-angle sunflower disk. A per-id hash adds a small reproducible jitter
 * so identical indices never coincide.
 */
export function seedPositions(nodes: readonly AtlasNode[], options: SeedOptions = {}): LayoutPosition[] {
  const dims = options.dimensions ?? DEFAULTS.dimensions;
  const area = options.area ?? DEFAULTS.area;
  const seed = options.seed ?? DEFAULTS.seed;
  const n = nodes.length;
  if (n === 0) return [];

  const radius = area / 2;
  const golden = Math.PI * (3 - Math.sqrt(5));

  return nodes.map((node, i) => {
    const jitter = hash01(node.id, seed);
    if (dims === 2) {
      const r = radius * Math.sqrt((i + 0.5) / n);
      const t = i * golden + jitter * 0.6;
      return { id: node.id, x: Math.cos(t) * r, y: Math.sin(t) * r, z: 0 };
    }
    const y = 1 - ((i + 0.5) / n) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * golden + jitter * 0.4;
    return { id: node.id, x: Math.cos(phi) * ring * radius, y: y * radius, z: Math.sin(phi) * ring * radius };
  });
}

/** Re-centre on the origin and scale so the farthest node sits at `radius`. */
export function normalizeLayout(positions: LayoutPosition[], radius = 1): LayoutPosition[] {
  const n = positions.length;
  if (n === 0) return [];

  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const p of positions) {
    cx += p.x;
    cy += p.y;
    cz += p.z;
  }
  cx /= n;
  cy /= n;
  cz /= n;

  let max = 0;
  for (const p of positions) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dz = p.z - cz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > max) max = d;
  }

  const scale = max > 0 ? radius / max : 1;
  return positions.map((p) => ({
    id: p.id,
    x: (p.x - cx) * scale,
    y: (p.y - cy) * scale,
    z: (p.z - cz) * scale,
  }));
}

/**
 * Deterministic Fruchterman–Reingold force-directed layout.
 *
 * Repulsion is the full O(n^2) pairwise sum, which is fine at snapshot scale
 * (tens to low hundreds of nodes); a Barnes–Hut approximation is the natural
 * next step for larger graphs. Attraction runs along edges and is scaled by
 * edge weight, so strongly related nodes sit closer. Gravity is stronger for
 * high-adjacency nodes, which settles the most relevant points near the centre.
 *
 * The result is identical for identical inputs — no Math.random is used.
 */
export function computeLayout(
  nodes: readonly AtlasNode[],
  edges: readonly AtlasEdge[],
  options: LayoutOptions = {},
  onIteration?: LayoutIterationCallback,
): LayoutPosition[] {
  const n = nodes.length;
  if (n === 0) return [];

  const dims = options.dimensions ?? DEFAULTS.dimensions;
  const area = options.area ?? DEFAULTS.area;
  const iterations = Math.max(1, options.iterations ?? DEFAULTS.iterations);
  const gravity = options.gravity ?? DEFAULTS.gravity;
  const seed = options.seed ?? DEFAULTS.seed;
  const scores = options.scores ?? {};
  const use3d = dims === 3;

  const seeded = seedPositions(nodes, { dimensions: dims, area, seed });
  const px = new Float64Array(n);
  const py = new Float64Array(n);
  const pz = new Float64Array(n);
  const ids: string[] = new Array(n);
  const idToIndex = new Map<string, number>();

  for (let i = 0; i < n; i += 1) {
    const p = seeded[i];
    px[i] = p.x;
    py[i] = p.y;
    pz[i] = p.z;
    ids[i] = p.id;
    idToIndex.set(p.id, i);
  }

  if (n === 1) {
    return normalizeLayout([{ id: ids[0], x: 0, y: 0, z: 0 }]);
  }

  const links: { a: number; b: number; w: number }[] = [];
  for (const e of edges) {
    const a = idToIndex.get(e.source);
    const b = idToIndex.get(e.target);
    if (a === undefined || b === undefined || a === b) continue;
    links.push({ a, b, w: e.weight });
  }

  const k = use3d ? area / Math.cbrt(n) : area / Math.sqrt(n);
  const kSq = k * k;
  const dx = new Float64Array(n);
  const dy = new Float64Array(n);
  const dz = new Float64Array(n);

  let temp = area * 0.12;
  const cooling = temp / (iterations + 1);

  for (let iter = 0; iter < iterations; iter += 1) {
    dx.fill(0);
    dy.fill(0);
    dz.fill(0);

    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        let ddx = px[i] - px[j];
        let ddy = py[i] - py[j];
        let ddz = use3d ? pz[i] - pz[j] : 0;
        let distSq = ddx * ddx + ddy * ddy + ddz * ddz;
        if (distSq < 1e-6) {
          // deterministic nudge so coincident nodes separate reproducibly
          ddx = (hash01(ids[i] + ids[j], seed) - 0.5) * 0.01;
          ddy = (hash01(ids[j] + ids[i], seed) - 0.5) * 0.01;
          ddz = use3d ? (hash01(`${ids[i]}|z`, seed) - 0.5) * 0.01 : 0;
          distSq = ddx * ddx + ddy * ddy + ddz * ddz + 1e-6;
        }
        const dist = Math.sqrt(distSq);
        const force = kSq / dist;
        const fx = (ddx / dist) * force;
        const fy = (ddy / dist) * force;
        const fz = (ddz / dist) * force;
        dx[i] += fx;
        dy[i] += fy;
        dz[i] += fz;
        dx[j] -= fx;
        dy[j] -= fy;
        dz[j] -= fz;
      }
    }

    for (const link of links) {
      const a = link.a;
      const b = link.b;
      const ddx = px[a] - px[b];
      const ddy = py[a] - py[b];
      const ddz = use3d ? pz[a] - pz[b] : 0;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) + 1e-6;
      const force = ((dist * dist) / k) * (0.4 + link.w);
      const fx = (ddx / dist) * force;
      const fy = (ddy / dist) * force;
      const fz = (ddz / dist) * force;
      dx[a] -= fx;
      dy[a] -= fy;
      dz[a] -= fz;
      dx[b] += fx;
      dy[b] += fy;
      dz[b] += fz;
    }

    for (let i = 0; i < n; i += 1) {
      const score = scores[ids[i]] ?? 0;
      const g = gravity * (0.6 + score / 100);
      dx[i] -= px[i] * g;
      dy[i] -= py[i] * g;
      if (use3d) dz[i] -= pz[i] * g;
    }

    for (let i = 0; i < n; i += 1) {
      const len = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i] + dz[i] * dz[i]) + 1e-9;
      const scale = Math.min(len, temp) / len;
      px[i] += dx[i] * scale;
      py[i] += dy[i] * scale;
      if (use3d) pz[i] += dz[i] * scale;
    }

    temp = Math.max(temp - cooling, area * 0.002);

    if (onIteration) {
      const snap: LayoutPosition[] = new Array(n);
      for (let i = 0; i < n; i += 1) {
        snap[i] = { id: ids[i], x: px[i], y: py[i], z: use3d ? pz[i] : 0 };
      }
      onIteration(normalizeLayout(snap), iter);
    }
  }

  const result: LayoutPosition[] = new Array(n);
  for (let i = 0; i < n; i += 1) {
    result[i] = { id: ids[i], x: px[i], y: py[i], z: use3d ? pz[i] : 0 };
  }
  return normalizeLayout(result);
}

/** Index a position list by node id. */
export function layoutToRecord(positions: LayoutPosition[]): Record<string, LayoutPosition> {
  const record: Record<string, LayoutPosition> = {};
  for (const p of positions) record[p.id] = p;
  return record;
}
