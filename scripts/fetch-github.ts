/**
 * Fetch real public signals from the GitHub Search API for each concept in the
 * curated source list. Writes raw results to data/raw/github/<id>.json.
 *
 *   pnpm ingest:github
 *
 * No invented data: the script records exactly what the API returns (repo
 * counts, top repositories, their stars and push dates). A GITHUB_TOKEN raises
 * the rate limit but is optional.
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
  queries: { github?: string };
}
interface SourcesFile {
  concepts: SourceConcept[];
}

interface GitHubRepo {
  full_name: string;
  stargazers_count: number;
  pushed_at: string;
  created_at: string;
  html_url: string;
}
interface GitHubSearch {
  total_count: number;
  items: GitHubRepo[];
}

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function main(): Promise<void> {
  const sources = readJsonFile<SourcesFile>(resolve(ROOT, "data/sources/eprv-sources.seed.json"));
  ensureDir(RAW_DIR);

  let fetched = 0;
  for (const concept of sources.concepts) {
    const query = concept.queries.github;
    if (!query) continue;

    const url =
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}` +
      `&sort=stars&order=desc&per_page=10`;

    const data = await cachedFetchJson<GitHubSearch>(url, {
      ttlMs: DEFAULT_TTL_MS,
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...authHeaders() },
      label: `github:${concept.id}`,
    });

    if (!data) {
      console.log(`  - ${concept.id}: no data (skipped)`);
      continue;
    }

    const top = (data.items ?? []).slice(0, 10).map((r) => ({
      full_name: r.full_name,
      stars: r.stargazers_count,
      pushed_at: r.pushed_at,
      created_at: r.created_at,
      url: r.html_url,
    }));

    const record = {
      source: "github-search",
      query,
      totalCount: data.total_count,
      top,
      fetchedAt: new Date().toISOString(),
    };
    writeRaw("github", concept.id, record);
    fetched += 1;
    console.log(`  ${concept.id}: ${data.total_count} repos; top = ${top[0]?.full_name ?? "(none)"}`);

    // Polite delay: unauthenticated GitHub search allows ~10 requests/minute.
    await sleep(process.env.GITHUB_TOKEN ? 600 : 1500);
  }

  console.log(`\nGitHub ingest complete: ${fetched} concept(s). Raw results in data/raw/github/.`);
  if (fetched === 0) {
    console.log("No results — you may be rate-limited. Set GITHUB_TOKEN in .env to raise the limit.");
  }
}

void main();
