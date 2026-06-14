# Seed dataset

This directory bootstraps the pipeline with a small, hand-curated graph so the
engine, schemas, and web surface have something concrete to build against
before any live fetch has run.

The reference domain is **extreme-precision radial velocity (EPRV)
instrumentation**.

## Important: what the numbers mean

The `activity` series, `implementations`, and `maturityYears` in
`concepts.seed.json` are **illustrative seed values** chosen to exercise the
scoring model across a realistic range. They are *not* measured statistics and
must not be cited as such. Real snapshots are produced from live signals by:

```
scripts/fetch-github.ts   # code-activity signals
scripts/fetch-papers.ts   # literature signals
scripts/build-snapshot.ts # normalise + score + serialise
```

The node `summary` text describes each entity factually; the `signals` block is
synthetic scaffolding.

## Files

| File                  | Contents                                  |
| --------------------- | ----------------------------------------- |
| `concepts.seed.json`  | Array of `AtlasNode` (validated by `node.schema.json`) |
| `edges.seed.json`     | Array of `AtlasEdge` (validated by `edge.schema.json`) |

## Validating the seed

Once `scripts/validate-snapshot.ts` lands, the seed is validated as part of
`pnpm snapshot:validate`. Until then, the JSON conforms to the schemas in
`data/schemas` by construction.
