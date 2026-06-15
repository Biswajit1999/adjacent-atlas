# Launch pack

Everything needed to take Adjacent Atlas public, in one place. Nothing here
fabricates metrics, stars, users, or screenshots.

Repository: https://github.com/Biswajit1999/adjacent-atlas

## One-line description

> An observatory for the adjacent possible — ranking the methods, instruments,
> and concepts adjacent to a research field's frontier from public code and
> literature signals. Seeded with extreme-precision radial velocity (EPRV)
> instrumentation.

## GitHub topics

```
research-tools  knowledge-graph  scientometrics  data-visualization
threejs  nextjs  typescript  monorepo  astronomy  exoplanets
radial-velocity  adjacent-possible
```

## What is real now vs. future work

**Real now**

- A typed scoring engine (momentum, recency, connectivity, novelty,
  feasibility → adjacency 0–100), fully tested.
- A deterministic force-directed 3D atlas (Three.js, worker layout) with search,
  filters, an inspector, graph statistics, an opportunity radar, and a timeline.
- Sourced briefs, per-brief pages, and authored field notes.
- An honest ingestion pipeline (GitHub Search API + OpenAlex) with caching and
  transparent attribution; a labelled seed graph as the default.
- Deployment metadata (OG image, robots, sitemap, icon) and docs.

**Future work (not claimed as done)**

- Snapshot history and a drift view across snapshots.
- Barnes–Hut layout for larger graphs.
- Additional reference domains beyond EPRV.
- In-canvas keyboard traversal and an automated accessibility check in CI.
- arXiv / Semantic Scholar ingestion.

These boundaries are deliberate; see `docs/roadmap.md` and
`docs/field-notes/scoring-limitations.md`.

## Pre-launch checklist

- [ ] `pnpm.cmd build` / `pnpm.cmd typecheck` / `pnpm.cmd test` all pass
- [ ] Repo links consistent with the actual owner (`Biswajit1999`)
- [ ] Description and topics set on the GitHub *About* panel
- [ ] Screenshots captured locally (see `docs/screenshots.md`) and referenced
- [ ] Social card generated (`pnpm.cmd social-card`)
- [ ] CI green on the default branch
- [ ] No build artifacts or scratchpad files tracked (see `docs/quality-checklist.md`)

## Launch materials in this repo

- `docs/github-readme-showcase.md` — description, topics, and a showcase block.
- `docs/linkedin-post.md` — a launch post in the author's voice.
- `docs/website-integration.md` — link card, embed, and iframe options.
- `docs/screenshots.md` — capture procedure (no stock images).
- `design/prompts/` — image-generation briefs for the banner, social card, and
  demo composition.
