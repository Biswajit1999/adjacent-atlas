import "server-only";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildSnapshot,
  deserializeSnapshot,
  synthesizeBriefs,
  type AtlasEdge,
  type AtlasNode,
  type AtlasSnapshot,
  type Brief,
  type NodeScore,
} from "@adjacent-atlas/engine";

const DOMAIN = "extreme-precision radial velocity instrumentation";

let cachedSnapshot: AtlasSnapshot | null = null;

/** Walk up from the current working directory to the workspace root. */
function findRepoRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(resolve(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start;
}

function dataDir(): string {
  return resolve(findRepoRoot(process.cwd()), "data");
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

/** Build a snapshot directly from the seed graph as a fallback. */
function buildFromSeeds(): AtlasSnapshot {
  const root = dataDir();
  const nodes = readJson<AtlasNode[]>(resolve(root, "seeds/concepts.seed.json"));
  const edges = readJson<AtlasEdge[]>(resolve(root, "seeds/edges.seed.json"));

  const periods = nodes
    .flatMap((n) => n.signals.activity.map((p) => p.period))
    .sort();
  const from = periods.at(0) ?? "1970-01";
  const to = periods.at(-1) ?? from;

  return buildSnapshot({
    id: "eprv-seed",
    domain: DOMAIN,
    nodes,
    edges,
    sourceWindow: { from: `${from}-01`, to: `${to}-28` },
    generatedAt: new Date(),
  });
}

/** The newest persisted snapshot, or one built from seeds. Memoised per process. */
export function getSnapshot(): AtlasSnapshot {
  if (cachedSnapshot) return cachedSnapshot;

  let snapshot: AtlasSnapshot;
  try {
    const dir = resolve(dataDir(), "snapshots");
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
    const newest = files.at(-1);
    snapshot = newest
      ? deserializeSnapshot(readFileSync(resolve(dir, newest), "utf8"))
      : buildFromSeeds();
  } catch {
    snapshot = buildFromSeeds();
  }

  cachedSnapshot = snapshot;
  return snapshot;
}

export interface RankedEntry {
  node: AtlasNode;
  score: NodeScore;
}

/** Nodes paired with their scores, highest adjacency first. */
export function getRanked(): RankedEntry[] {
  const snapshot = getSnapshot();
  const nodeById = new Map(snapshot.nodes.map((n) => [n.id, n] as const));

  const entries: RankedEntry[] = [];
  for (const score of [...snapshot.scores].sort((a, b) => b.adjacency - a.adjacency)) {
    const node = nodeById.get(score.nodeId);
    if (node) entries.push({ node, score });
  }
  return entries;
}

/** Persisted briefs for the current snapshot, or freshly synthesised ones. */
export function getBriefs(): Brief[] {
  const snapshot = getSnapshot();
  try {
    const file = resolve(dataDir(), "briefs", `${snapshot.meta.id}.briefs.json`);
    if (existsSync(file)) return readJson<Brief[]>(file);
  } catch {
    // fall through to synthesis
  }
  return synthesizeBriefs(snapshot.nodes, snapshot.scores).sort(
    (a, b) => b.adjacency - a.adjacency,
  );
}

export function getBriefForNode(nodeId: string): Brief | undefined {
  return getBriefs().find((b) => b.nodeId === nodeId);
}
