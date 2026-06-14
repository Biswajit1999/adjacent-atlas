/**
 * Validate a snapshot file against the data contracts.
 *
 *   pnpm snapshot:validate                 # validates the newest snapshot
 *   pnpm snapshot:validate path/to.json    # validates a specific file
 *
 * Checks structure, value ranges, referential integrity of edges and scores,
 * and that the stored scores reproduce when re-run by the engine.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreSnapshot,
  validateEdges,
  type AtlasSnapshot,
} from "../packages/engine/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const PERIOD_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])$/;
const DATE_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const NODE_KINDS = new Set(["concept", "method", "instrument", "dataset", "repo", "paper"]);
const EDGE_KINDS = new Set(["relates", "depends", "cites", "implements", "supersedes"]);
const BREAKDOWN_KEYS = ["momentum", "recency", "connectivity", "novelty", "feasibility"] as const;

function resolveTarget(): string {
  const arg = process.argv[2];
  if (arg) return resolve(process.cwd(), arg);

  const dir = resolve(ROOT, "data/snapshots");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const newest = files.at(-1);
  if (!newest) {
    console.error("No snapshot found in data/snapshots. Run `pnpm snapshot` first.");
    process.exit(1);
  }
  return resolve(dir, newest);
}

function inUnit(value: unknown): boolean {
  return typeof value === "number" && value >= 0 && value <= 1;
}

function validate(snapshot: AtlasSnapshot): string[] {
  const problems: string[] = [];
  const { meta, nodes, edges, scores } = snapshot;

  // Meta
  if (!meta || !ID_PATTERN.test(meta.id)) problems.push("meta.id is missing or malformed");
  if (!meta?.domain) problems.push("meta.domain is empty");
  if (!DATE_PATTERN.test(meta?.sourceWindow?.from ?? "")) problems.push("meta.sourceWindow.from is not a date");
  if (!DATE_PATTERN.test(meta?.sourceWindow?.to ?? "")) problems.push("meta.sourceWindow.to is not a date");
  if (meta?.nodeCount !== nodes.length) problems.push("meta.nodeCount does not match nodes.length");
  if (meta?.edgeCount !== edges.length) problems.push("meta.edgeCount does not match edges.length");

  // Nodes
  const ids = new Set<string>();
  for (const node of nodes) {
    if (!ID_PATTERN.test(node.id)) problems.push(`node id malformed: ${node.id}`);
    if (ids.has(node.id)) problems.push(`duplicate node id: ${node.id}`);
    ids.add(node.id);
    if (!NODE_KINDS.has(node.kind)) problems.push(`node ${node.id} has invalid kind: ${node.kind}`);
    if (!node.summary) problems.push(`node ${node.id} has empty summary`);

    const s = node.signals;
    if (!DATE_PATTERN.test(s?.lastActiveAt ?? "")) problems.push(`node ${node.id} lastActiveAt is not a date`);
    if (!Number.isInteger(s?.implementations) || s.implementations < 0) {
      problems.push(`node ${node.id} implementations must be a non-negative integer`);
    }
    if (typeof s?.maturityYears !== "number" || s.maturityYears < 0) {
      problems.push(`node ${node.id} maturityYears must be >= 0`);
    }
    for (const point of s?.activity ?? []) {
      if (!PERIOD_PATTERN.test(point.period)) problems.push(`node ${node.id} has invalid period: ${point.period}`);
      if (typeof point.value !== "number" || point.value < 0) {
        problems.push(`node ${node.id} has invalid activity value at ${point.period}`);
      }
    }
  }

  // Edges
  for (const e of edges) {
    if (!EDGE_KINDS.has(e.kind)) problems.push(`edge ${e.id} has invalid kind: ${e.kind}`);
    if (typeof e.weight !== "number" || e.weight < 0 || e.weight > 1) {
      problems.push(`edge ${e.id} weight must be within [0, 1]`);
    }
  }
  problems.push(...validateEdges(nodes, edges));

  // Scores: structure
  for (const score of scores) {
    if (!ids.has(score.nodeId)) problems.push(`score references unknown node: ${score.nodeId}`);
    if (typeof score.adjacency !== "number" || score.adjacency < 0 || score.adjacency > 100) {
      problems.push(`score for ${score.nodeId} adjacency out of range`);
    }
    for (const key of BREAKDOWN_KEYS) {
      if (!inUnit(score.breakdown?.[key])) problems.push(`score for ${score.nodeId} ${key} out of [0, 1]`);
    }
  }

  // Scores: reproducibility
  const recomputed = scoreSnapshot(nodes, edges, { now: new Date(meta.generatedAt) });
  const recomputedById = new Map(recomputed.map((s) => [s.nodeId, s.adjacency]));
  for (const score of scores) {
    const expected = recomputedById.get(score.nodeId);
    if (expected === undefined) continue;
    if (Math.abs(expected - score.adjacency) > 0.1) {
      problems.push(
        `score for ${score.nodeId} does not reproduce: stored ${score.adjacency}, recomputed ${expected}`,
      );
    }
  }

  return problems;
}

function main(): void {
  const target = resolveTarget();
  const snapshot = JSON.parse(readFileSync(target, "utf8")) as AtlasSnapshot;
  const problems = validate(snapshot);

  if (problems.length === 0) {
    console.log(`OK: ${target}`);
    console.log(`  ${snapshot.nodes.length} nodes, ${snapshot.edges.length} edges, ${snapshot.scores.length} scores`);
    return;
  }

  console.error(`INVALID: ${target}`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

main();
