# Sources

`eprv-sources.seed.json` is the curated input to the ingestion pipeline. It is
tracked in version control because it is hand-authored, not generated.

## What it contains

For each concept:

- `id`, `label`, `kind`, `summary`, `tags` — factual descriptors (the same
  wording used on the atlas).
- `maturityYears` — a **rough human estimate** of how long the technique has
  been established in the field. It is an estimate, not a measurement.
- `queries.github` / `queries.openalex` — plain-text search queries describing
  the concept. The fetch scripts send these to the public APIs; whatever they
  return is real.

And a list of curated `edges` (relationships between concepts), with weights set
by hand to express how strongly two techniques are coupled.

## What is real vs. authored

| Field                      | Origin                                           |
| -------------------------- | ------------------------------------------------ |
| node `activity` series     | OpenAlex works-per-year counts (real)            |
| node `implementations`     | GitHub repository count for the query (real)     |
| node `lastActiveAt`        | most recent GitHub push / latest paper year (real)|
| node `maturityYears`       | authored estimate (labelled)                     |
| `summary`, `tags`, `label` | authored, factual                                |
| `edges` and weights        | authored, curated                                |
| `queries`                  | authored, factual descriptors                    |

## Running the pipeline

```bash
pnpm ingest:github      # GitHub Search API  -> data/raw/github/*.json
pnpm ingest:papers      # OpenAlex           -> data/raw/papers/*.json
pnpm ingest:normalise   # merge              -> data/raw/normalised.json
pnpm snapshot           # score              -> data/snapshots/<id>.json
```

If you skip ingestion, `pnpm snapshot` uses the labelled seed graph in
`data/seeds` instead, and ids are prefixed `eprv-seed-` so the two are never
confused.
