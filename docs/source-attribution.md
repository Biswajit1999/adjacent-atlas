# Source attribution

Adjacent Atlas's ingestion pipeline queries third-party public APIs. This file
records what is used and under what terms, and what the project stores.

## GitHub

- API: GitHub REST API v3 (search/repositories).
- Use: counts and public repository metadata (name, stars, timestamps, URL).
- Terms: subject to the GitHub Terms of Service and API rate limits. The project
  stores only small factual summaries (counts and the top results) under
  `data/raw/github/`, for transparency; it does not redistribute repository
  contents.
- Attribution: data © the respective repository owners; access via GitHub.

## OpenAlex

- API: OpenAlex works endpoint with `group_by=publication_year`.
- Use: per-year works counts.
- Terms: OpenAlex data is released under CC0 (public domain dedication). A
  contact email (`OPENALEX_MAILTO`) is optional and only used to join the faster
  request pool.
- Attribution: "Data from OpenAlex (https://openalex.org), CC0."

## What the repository stores

- `data/raw/**` — verbatim, small JSON summaries of the API responses, for
  inspection. Generated and gitignored.
- `data/cache/**` — HTTP response cache. Generated and gitignored.
- `data/raw/normalised.json` — derived node/edge signals. Generated.
- `data/snapshots/**`, `data/briefs/**` — scored output. Generated and
  gitignored unless deliberately committed.

## What the repository does not do

- It does not claim authorship of, or redistribute, any paper, dataset, or
  repository it queries.
- It does not invent paper metadata, authors, citations, or results. Only the
  counts returned by the APIs are stored and scored.
- It does not present search-derived proxies as authoritative measurements; see
  the honesty note in `docs/data-sources.md`.

If you deploy Adjacent Atlas publicly with live ingestion, you are responsible
for complying with each API's terms of service.
