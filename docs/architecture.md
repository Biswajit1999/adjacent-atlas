# Architecture

Adjacent Atlas is a pnpm + Turborepo monorepo with a clear separation between a
framework-agnostic engine, presentation packages, and a Next.js application.

## Packages and apps

```
packages/engine   pure TypeScript: types, scoring, graph, layout, synthesis, export
packages/ui       React component library and design tokens
packages/embed     dependency-light embeddable view
apps/web          Next.js 14 app-router site and JSON API
```

The engine has no dependency on React, the DOM, or Node-only APIs, which is why
the same code runs in three places: the build script (Node), the web server
(Node), and the layout Web Worker (browser).

## Data flow

```
fetch (code + papers) → normalise → score → snapshot (validated JSON) → render
```

1. `scripts/fetch-github.ts` and `scripts/fetch-papers.ts` collect raw signals.
2. `scripts/build-snapshot.ts` normalises them and calls `buildSnapshot`.
3. `packages/engine` scores nodes and serialises an `AtlasSnapshot`.
4. `apps/web/lib/snapshot.ts` is the single server read path; it loads the
   newest snapshot or, failing that, builds one from the seed graph.
5. The atlas, briefs, method page, and `/api/*` routes all read that snapshot.

## The 3D atlas

The interactive atlas is built on Three.js directly (no react-three-fiber) for
full control over the render loop and resource lifecycle. Layout is computed by
`packages/engine/src/graph/layout.ts` — a deterministic force-directed
algorithm — and runs in `apps/web/workers/layout.worker.ts` off the main
thread. When Web Workers are unavailable, the same function runs synchronously
via `runLayoutSync`; the seed graph is small enough that this is imperceptible.

`AtlasShell` coordinates state (filters, selection, hover, positions); `AtlasScene`
owns the WebGL context and disposes every geometry, material, and texture on
unmount.

## Why a monorepo

The engine is the contract. Keeping it in its own package — with the JSON
Schemas under `data/schemas` mirroring its types — means the scoring logic can
be tested, versioned, and embedded independently of the web surface.
