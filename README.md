# Adjacent Atlas

**An observatory for the adjacent possible in scientific research.**

Adjacent Atlas is a research-mapping tool that reads public signals from code, papers, and curated domain knowledge, then ranks the methods, instruments, and concepts that sit close to a field’s frontier — close enough to be worked on next.

It combines a transparent scoring engine, a typed data model, and an interactive 3D atlas to make emerging research directions visible rather than guessed.

The first reference domain is **extreme-precision radial velocity (EPRV) instrumentation**, chosen because it sits at the intersection of astronomy, optics, calibration, environmental control, photonics, and data reduction.

> Status: `v0.1.0` — early working scaffold.
> The scoring engine, schemas, seed graph, web app, tests, and 3D atlas foundation are in place. The live data ingestion pipeline is the next active development stage.

---

## Why this exists

Most research discovery tools answer a familiar question:

> “What is already popular?”

Adjacent Atlas is built around a different question:

> “What is becoming reachable next?”

For instrument-heavy fields, the next useful idea is rarely the most cited paper or the flashiest repository. It is often the concept sitting between several active areas: technically feasible, recently moving, connected to mature work, but still underdeveloped.

Adjacent Atlas tries to make that region visible.

---

## What it does

```text
public signals + curated seeds
        ↓
normalised nodes and edges
        ↓
transparent scoring model
        ↓
validated snapshot
        ↓
3D atlas + ranked briefs
```

Each node receives an **adjacency score** from 0–100 using five explainable components:

| Component      | Meaning                                                |
| -------------- | ------------------------------------------------------ |
| `momentum`     | Is recent activity increasing?                         |
| `recency`      | Has the idea moved recently?                           |
| `connectivity` | Is it connected to nearby methods or instruments?      |
| `novelty`      | Is it still young enough to have open space?           |
| `feasibility`  | Are there enough implementations to make it buildable? |

The scoring model is deliberately transparent. It is **not** a black-box predictor and does not claim to forecast scientific breakthroughs.

---

## Scoring at a glance

```text
adjacency = 100 × (
  0.30 × momentum
+ 0.20 × recency
+ 0.20 × connectivity
+ 0.15 × novelty
+ 0.15 × feasibility
)
```

Every component is shown in the interface so the ranking can be inspected rather than blindly trusted.

Full details: [`docs/scoring-model.md`](./docs/scoring-model.md)

---

## Current features

* TypeScript monorepo using `pnpm` and Turborepo
* Framework-independent scoring engine
* JSON Schemas for nodes, edges, snapshots, and briefs
* EPRV seed graph for a concrete first domain
* Deterministic graph layout utilities
* Next.js web app with atlas, briefs, method, and about pages
* Three.js-based 3D atlas foundation
* Reusable UI primitives and design tokens
* Embeddable package for future website integration
* Snapshot build and validation scripts
* Unit tests for engine and web utilities
* Documentation for architecture, methodology, scoring, visual language, and launch planning

---

## Screenshots

Screenshots are intentionally generated from the local app rather than committed as stock images.

To capture them:

```bash
pnpm --filter @adjacent-atlas/web dev
```

Then open:

```text
http://localhost:3000
http://localhost:3000/atlas
http://localhost:3000/briefs
http://localhost:3000/method
```

Recommended capture size: `1440 × 900`.

A generated SVG social card can be produced with:

```bash
pnpm tsx scripts/export-social-card.ts
```

Output:

```text
apps/web/public/social/card.svg
```

---

## Repository layout

| Path              | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `apps/web`        | Next.js app, 3D atlas, API routes, pages      |
| `packages/engine` | Scoring, graph, layout, synthesis, export     |
| `packages/ui`     | Shared React primitives and design tokens     |
| `packages/embed`  | Lightweight embeddable atlas view             |
| `data/schemas`    | JSON Schemas for the core data contracts      |
| `data/seeds`      | Initial EPRV seed graph                       |
| `scripts`         | Snapshot, validation, and social-card tooling |
| `docs`            | Architecture, methodology, scoring, roadmap   |
| `design`          | Visual tokens and image-generation prompts    |
| `tests`           | Shared test space                             |

---

## Local setup

Requires:

* Node.js `>= 20`
* pnpm `>= 9`

Install dependencies:

```bash
pnpm install
```

Build all packages and the web app:

```bash
pnpm build
```

Run type checks:

```bash
pnpm typecheck
```

Run tests:

```bash
pnpm test
```

Run the web app:

```bash
pnpm --filter @adjacent-atlas/web dev
```

On Windows PowerShell, if `pnpm` is blocked by script execution policy, use:

```powershell
pnpm.cmd install
pnpm.cmd build
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd --filter @adjacent-atlas/web dev
```

---

## Snapshot workflow

Generate a local snapshot:

```bash
pnpm snapshot
```

Validate it:

```bash
pnpm snapshot:validate
```

Generated snapshots and briefs are local artifacts by default and are not committed unless deliberately added.

---

## Important data note

The seed graph in `data/seeds` is designed to exercise the scoring model and interface. Some signal values are illustrative scaffolding, not measured statistics.

Adjacent Atlas separates:

1. **curated seed data** — useful for development and demonstration,
2. **generated snapshots** — produced by the pipeline,
3. **future live ingestion** — GitHub/literature sources with transparent attribution.

No fake paper metadata, fake citations, or fake performance claims should be added.

---

## Roadmap

Planned next stages:

* real GitHub and literature ingestion pipeline,
* cached source snapshots with attribution,
* snapshot history and research-drift visualisation,
* richer 3D atlas interaction,
* additional scientific domains beyond EPRV,
* public deployment and website embedding,
* launch-ready screenshots and documentation.

Full roadmap: [`docs/roadmap.md`](./docs/roadmap.md)

---

## Built with

* TypeScript
* Next.js
* React
* Three.js
* pnpm workspaces
* Turborepo
* Vitest
* JSON Schema

---

## Ownership

Built and maintained by **Biswajit Jana**.

GitHub: [@Biswajit1999](https://github.com/Biswajit1999)

This project reflects my interest in astronomical instrumentation, extreme-precision radial velocity methods, research software, and interactive scientific visualisation.

---

## License

Released under the MIT License.

See [`LICENSE`](./LICENSE).
