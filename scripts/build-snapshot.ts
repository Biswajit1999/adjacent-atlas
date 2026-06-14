/**
 * Build a scored snapshot (and top briefs) from the seed graph.
 *
 * Run from the repository root:
 *   pnpm snapshot
 *
 * Output:
 *   data/snapshots/<id>.json
 *   data/briefs/<id>.briefs.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSnapshot,
  serializeSnapshot,
  synthesizeBriefs,
  validateEdges,
  type AtlasEdge,
  type AtlasNode,
} from "../packages/engine/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DOMAIN = "extreme-precision radial velocity instrumentation";

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, relativePath), "utf8")) as T;
}

function yyyymmdd(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function sourceWindow(nodes: AtlasNode[]): { from: string; to: string } {
  const periods = nodes
    .flatMap((n) => n.signals.activity.map((p) => p.period))
    .sort();
  const from = periods.at(0) ?? "1970-01";
  const to = periods.at(-1) ?? from;
  return { from: `${from}-01`, to: `${to}-28` };
}

function main(): void {
  const nodes = readJson<AtlasNode[]>("data/seeds/concepts.seed.json");
  const edges = readJson<AtlasEdge[]>("data/seeds/edges.seed.json");

  const edgeProblems = validateEdges(nodes, edges);
  if (edgeProblems.length > 0) {
    console.error("Seed graph is invalid:");
    for (const p of edgeProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const generatedAt = new Date();
  const id = `eprv-${yyyymmdd(generatedAt)}`;

  const snapshot = buildSnapshot({
    id,
    domain: DOMAIN,
    nodes,
    edges,
    sourceWindow: sourceWindow(nodes),
    generatedAt,
  });

  const topBriefs = synthesizeBriefs(snapshot.nodes, snapshot.scores, { now: generatedAt })
    .sort((a, b) => b.adjacency - a.adjacency)
    .slice(0, 5);

  mkdirSync(resolve(ROOT, "data/snapshots"), { recursive: true });
  mkdirSync(resolve(ROOT, "data/briefs"), { recursive: true });

  const snapshotPath = resolve(ROOT, `data/snapshots/${id}.json`);
  const briefsPath = resolve(ROOT, `data/briefs/${id}.briefs.json`);

  writeFileSync(snapshotPath, serializeSnapshot(snapshot));
  writeFileSync(briefsPath, `${JSON.stringify(topBriefs, null, 2)}\n`);

  const ranked = [...snapshot.scores].sort((a, b) => b.adjacency - a.adjacency);
  console.log(`Snapshot ${id}: ${snapshot.nodes.length} nodes, ${snapshot.edges.length} edges`);
  console.log("Top by adjacency:");
  for (const s of ranked.slice(0, 5)) {
    console.log(`  ${s.adjacency.toFixed(1).padStart(5)}  ${s.nodeId}`);
  }
  console.log(`Wrote ${snapshotPath}`);
  console.log(`Wrote ${briefsPath}`);
}

main();
