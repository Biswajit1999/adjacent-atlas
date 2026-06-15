# Data sources

Adjacent Atlas can run on two kinds of input: a small, clearly-labelled seed
graph (default), or real public signals pulled by the ingestion pipeline. This
document describes the real sources and is honest about what the numbers mean.

## Sources used

**GitHub Search API** (`https://api.github.com/search/repositories`).
For each concept's query the pipeline records the total repository count and the
top repositories (full name, stars, push/create dates). This is a proxy for how
much public *code* activity surrounds a technique.

- Unauthenticated search is limited to ~10 requests/minute. Set `GITHUB_TOKEN`
  in your environment to raise the limit (see `.env.example`).

**OpenAlex** (`https://api.openalex.org/works`).
For each concept's query the pipeline records the number of works grouped by
publication year. This is a proxy for *literature* volume and its trend. OpenAlex
is free, key-less, and its data is CC0. Setting `OPENALEX_MAILTO` joins the
faster "polite pool" but is optional.

## What the numbers honestly are

These are **coarse public-signal proxies, not curated bibliometrics.** A GitHub
search for "stellar activity radial velocity" will include repositories that are
only loosely related, and an OpenAlex keyword search is not a systematic
literature review. The scores are useful for a *relative*, at-a-glance sense of
momentum and reach across techniques in one field — not for citation counting or
any quantitative claim about a specific paper or project.

The mapping from raw responses to engine signals is documented in
`scripts/source-normalise.ts` and summarised in `data/sources/README.md`.

## Caching and rate limits

`scripts/cache-utils.ts` caches every response under `data/cache/` keyed by a
hash of the URL, with a 24-hour TTL. Re-running the fetch scripts within a day
serves from cache and makes no network calls. Raw responses are also written
verbatim under `data/raw/` for inspection and attribution.

`data/raw/` and `data/cache/` contents are gitignored; only the `.gitkeep`
files are tracked.

## Not implemented (deliberately)

arXiv and Semantic Scholar are reasonable additional literature sources. They are
*not* wired up here, because adding them superficially would invite
inconsistent or misleading counts. They are noted as future work in
`docs/roadmap.md` rather than stubbed.
