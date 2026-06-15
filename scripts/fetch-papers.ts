/**
 * Fetch real literature signals from OpenAlex (https://openalex.org), a free,
 * key-less, CC0 scholarly index. For each concept it records the works count
 * grouped by publication year. Writes data/raw/papers/<id>.json.
 *
 *   pnpm ingest:papers
 *
 * No invented metadata: only counts returned by the API are stored. Setting
 * OPENALEX_MAILTO joins OpenAlex's faster "polite pool" but is optional.
 *
 * arXiv and Semantic Scholar are documented in docs/data-sources.md as
 * alternative sources; they are intentionally not wired up here rather than
 * implemented superficially.
 */
import { resolve } from "node:path";
import {
  DEFAULT_TTL_MS,
  RAW_DIR,
  ROOT,
  cachedFetchJson,
  ensureDir,
  readJsonFile,
  sleep,
  writeRaw,
} from "./cache-utils.js";

interface SourceConcept {
  id: string;
  queries: { openalex?: string };
}
interface SourcesFile {
  concepts: SourceConcept[];
}

interface OpenAlexGroup {
  key: string;
  key_display_name: string;
  count: number;
}
interface OpenAlexResponse {
  meta: { count: number };
  group_by: OpenAlexGroup[];
}

function mailtoParam(): string {
  const mailto = process.env.OPENALEX_MAILTO;
  return mailto ? `&mailto=${encodeURIComponent(mailto)}` : "";
}

async function main(): Promise<void> {
  const sources = readJsonFile<SourcesFile>(resolve(ROOT, "data/sources/eprv-sources.seed.json"));
  ensureDir(RAW_DIR);

  let fetched = 0;
  for (const concept of sources.concepts) {
    const query = concept.queries.openalex;
    if (!query) continue;

    const url =
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}` +
      `&group_by=publication_year${mailtoParam()}`;

    const data = await cachedFetchJson<OpenAlexResponse>(url, {
      ttlMs: DEFAULT_TTL_MS,
      label: `openalex:${concept.id}`,
    });

    if (!data) {
      console.log(`  - ${concept.id}: no data (skipped)`);
      continue;
    }

    const byYear = (data.group_by ?? [])
      .filter((g) => /^\d{4}$/.test(g.key))
      .map((g) => ({ year: g.key, count: g.count }))
      .sort((a, b) => a.year.localeCompare(b.year));

    const record = {
      source: "openalex",
      query,
      total: data.meta?.count ?? 0,
      byYear,
      fetchedAt: new Date().toISOString(),
    };
    writeRaw("papers", concept.id, record);
    fetched += 1;
    console.log(`  ${concept.id}: ${record.total} works across ${byYear.length} year(s)`);

    await sleep(1000);
  }

  console.log(`\nPaper ingest complete: ${fetched} concept(s). Raw results in data/raw/papers/.`);
}

void main();
