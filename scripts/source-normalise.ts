/**
 * Merge raw GitHub and OpenAlex signals into the engine's node/edge shape and
 * write data/raw/normalised.json. build-snapshot.ts consumes this file when it
 * exists, otherwise it falls back to the labelled seed graph.
 *
 *   pnpm ingest:normalise
 *
 * What maps to what (all derived from real API responses, nothing invented):
 *   - activity[]        literature volume per year (OpenAlex), as YYYY-01 points
 *   - implementations   count of public repositories found (GitHub), capped
 *   - lastActiveAt      most recent repo push, else latest publication year
 *   - maturityYears     curated estimate carried from the source list (labelled)
 *
 * These are coarse public-signal proxies, not curated bibliometrics — see
 * docs/data-sources.md.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { RAW_DIR, ROOT, readJsonFile, writeRaw } from "./cache-utils.js";
import type { AtlasEdge, AtlasNode, NodeKind, SignalPoint } from "../packages/engine/src/index.js";

interface SourceConcept {
  id: string;
  label: string;
  kind: NodeKind;
  summary: string;
  tags: string[];
  maturityYears: number;
}
interface SourcesFile {
  concepts: SourceConcept[];
  edges: AtlasEdge[];
}
interface GitHubRaw {
  totalCount: number;
  top: { full_name: string; pushed_at: string }[];
}
interface PapersRaw {
  total: number;
  byYear: { year: string; count: number }[];
}

const IMPLEMENTATION_CAP = 50;
const RECENT_YEARS = 6;

function activityFromYears(byYear: { year: string; count: number }[]): SignalPoint[] {
  return byYear
    .filter((y) => /^\d{4}$/.test(y.year))
    .slice(-RECENT_YEARS)
    .map((y) => ({ period: `${y.year}-01`, value: y.count }));
}

function main(): void {
  const sources = readJsonFile<SourcesFile>(resolve(ROOT, "data/sources/eprv-sources.seed.json"));
  const nodes: AtlasNode[] = [];

  for (const concept of sources.concepts) {
    const ghPath = resolve(RAW_DIR, "github", `${concept.id}.json`);
    const papersPath = resolve(RAW_DIR, "papers", `${concept.id}.json`);
    const gh = existsSync(ghPath) ? readJsonFile<GitHubRaw>(ghPath) : null;
    const papers = existsSync(papersPath) ? readJsonFile<PapersRaw>(papersPath) : null;
    if (!gh && !papers) continue;

    const activity = papers ? activityFromYears(papers.byYear) : [];
    const implementations = gh ? Math.min(gh.totalCount, IMPLEMENTATION_CAP) : 0;

    const pushDates = (gh?.top ?? []).map((r) => r.pushed_at).filter(Boolean).sort();
    const lastPush = pushDates.at(-1);
    const lastYear = papers?.byYear.at(-1)?.year;
    const lastActiveAt = lastPush ? lastPush.slice(0, 10) : lastYear ? `${lastYear}-01-01` : "1970-01-01";

    nodes.push({
      id: concept.id,
      label: concept.label,
      kind: concept.kind,
      summary: concept.summary,
      tags: concept.tags,
      signals: { activity, lastActiveAt, implementations, maturityYears: concept.maturityYears },
    });
  }

  if (nodes.length === 0) {
    console.error("No raw ingest data found. Run `pnpm ingest:github` and `pnpm ingest:papers` first.");
    process.exit(1);
  }

  const presentIds = new Set(nodes.map((n) => n.id));
  const edges = sources.edges.filter((e) => presentIds.has(e.source) && presentIds.has(e.target));

  const output = {
    generatedAt: new Date().toISOString(),
    domain: "extreme-precision radial velocity instrumentation",
    provenance: "GitHub Search API + OpenAlex; see data/raw/ and docs/source-attribution.md",
    nodes,
    edges,
  };
  const file = writeRaw(".", "normalised", output);
  console.log(`Normalised ${nodes.length} node(s), ${edges.length} edge(s) -> ${file}`);
  console.log("Run `pnpm snapshot` to score this into a snapshot.");
}

main();
