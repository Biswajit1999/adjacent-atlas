# Adjacent Atlas

**An observatory for the adjacent possible.** Adjacent Atlas reads public
signals — code activity and literature — and ranks the methods, instruments, and
concepts close enough to a field's frontier to be worked on next. It renders that
ranking as an interactive 3D atlas and a set of sourced briefs.

The reference map shipped with the repository is **extreme-precision radial
velocity (EPRV) instrumentation**.

> Status: `0.1.0`, early development. The engine and data schemas are stable
> enough to build on; the live fetch pipeline is the active edge.

## Screenshots

Screenshots are generated from the local app rather than committed as stock
images. To produce them, run the dev server (below), open `/` and `/atlas`, and
capture at 1440×900. A generated social card is available via
`pnpm tsx scripts/export-social-card.ts` → `apps/web/public/social/card.svg`.

## What it does

```
fetch (code + papers) → normalise → score → snapshot → render
```

Each node gets an **adjacency** score (0–100): a weighted mean of five
normalised components — momentum, recency, connectivity, novelty, feasibility.
The model is a transparent heuristic, not a trained predictor; weights are
visible and tunable. See [`docs/scoring-model.md`](./docs/scoring-model.md).

## Project story

Adjacent Atlas began as a way to make "what should I look at next?" answerable
from public signal rather than intuition alone — in a field (EPRV instrumentation)
where the gap between *interesting* and *reachable* is set by instrument
systematics. The result is closer to an instrument readout than a dashboard: dark,
quiet, and meant to be read closely.

## Repository layout

| Path                | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `apps/web`          | Next.js 14 site, 3D atlas, and JSON API            |
| `packages/engine`   | Scoring, graph, layout, synthesis, export          |
| `packages/ui`       | React primitives and design tokens                 |
| `packages/embed`    | Dependency-light embeddable view                   |
| `data/schemas`      | JSON Schemas for the data contracts                |
| `data/seeds`        | EPRV seed graph                                     |
| `scripts`           | Fetch, build, validate, and social-card tools      |
| `docs`              | Architecture, methodology, scoring, visual language|
| `design`            | Token specs and image-generation prompts           |

## Local setup

Requires Node ≥ 20 and pnpm ≥ 9 (`corepack enable`).

```bash
pnpm install
pnpm build        # builds engine + ui before the web app (turbo handles order)
pnpm typecheck
pnpm test
```

Run the web app (build the libraries first, or run their watch tasks):

```bash
pnpm --filter @adjacent-atlas/web dev
```

Generate and validate a snapshot:

```bash
pnpm snapshot
pnpm snapshot:validate
```

## Scoring at a glance

```
adjacency = 100 × ( 0.30·momentum + 0.20·recency + 0.20·connectivity
                    + 0.15·novelty + 0.15·feasibility )
```

Every component is shown on the atlas and in each brief, so a ranking can be
read, not just trusted.

## Roadmap

Real fetch implementations, snapshot history and drift, a Barnes–Hut layout for
larger graphs, and additional reference domains. Full list in
[`docs/roadmap.md`](./docs/roadmap.md).

## Deploying

Adjacent Atlas runs as a Node server (the API routes are dynamic), so it is not a
static export. Build with `pnpm build` and deploy to Vercel or any Node host; see
[`docs/deployment.md`](./docs/deployment.md). Integration into another site
(link, embed, or iframe) is covered in
[`docs/website-integration.md`](./docs/website-integration.md).
 Launch materials — repo description, topics, a LinkedIn post, and image briefs — are
collected in [`docs/launch-pack.md`](./docs/launch-pack.md).

## Ownership and license

Built and maintained by **Biswajit Jana** ([@Biswajit1999](https://github.com/Biswajit1999)).
Released under the MIT License — see [`LICENSE`](./LICENSE). The seed `signals`
values are illustrative scaffolding, not measured statistics; see
[`docs/methodology.md`](./docs/methodology.md).
