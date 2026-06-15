# Quality checklist

A short, repeatable pass before sharing the project or cutting a release.

## Build and types

- [ ] `pnpm build` succeeds (engine, ui, embed, then the web app)
- [ ] `pnpm typecheck` is clean
- [ ] `pnpm test` passes (engine + web suites)

## Data honesty

- [ ] Seed snapshots are labelled (`eprv-seed-…`); ingested ones are `eprv-…`
- [ ] No invented papers, citations, authors, or counts anywhere
- [ ] `docs/data-sources.md` and `docs/source-attribution.md` reflect what is
      actually fetched

## Accessibility (see `docs/accessibility.md`)

- [ ] Skip link works and is the first focusable element
- [ ] Visible focus ring on links, buttons, inputs, and the search field
- [ ] Filters, ranked list, and opportunity radar are keyboard-operable
- [ ] `prefers-reduced-motion` disables idle rotation, the selection pulse, and
      CSS animations
- [ ] The atlas degrades to the ranked list without WebGL / JavaScript

## Performance (see `docs/performance.md`)

- [ ] First Load JS for shared chunks stays near its current size
- [ ] Layout runs in the worker; the synchronous fallback only fires when needed
- [ ] No Three.js resources leak on unmount (geometries, materials, textures,
      and the renderer are disposed; RAF is cancelled)

## Repository hygiene

- [ ] No `node_modules`, `.next`, `dist`, `.turbo`, `coverage`, `.zip`,
      `CLAUDE.md`, or `.claude/` tracked
- [ ] Generated `data/raw`, `data/cache`, `data/snapshots`, `data/briefs`
      contents are gitignored (only `.gitkeep` tracked)
