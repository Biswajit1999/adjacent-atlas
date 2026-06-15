# Changelog

All notable changes to Adjacent Atlas are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [0.1.0] - 2026-06-14

First development release.

### Added

- **Engine** (`@adjacent-atlas/engine`): typed data model; adjacency scoring from
  five components (momentum, recency, connectivity, novelty, feasibility);
  graph helpers; deterministic force-directed layout; graph metrics (degree,
  density, tags, score distribution, opportunity ranking); brief synthesis;
  snapshot build/serialise; full unit tests.
- **UI** (`@adjacent-atlas/ui`): design tokens and primitives (Panel, Tag,
  ScoreBar, Button, Badge).
- **Embed** (`@adjacent-atlas/embed`): dependency-light ranked view and React
  component.
- **Web** (`apps/web`): Next.js 14 app with an interactive Three.js atlas
  (worker-driven layout, search, filters, inspector, graph statistics,
  opportunity radar, activity timeline), briefs and per-brief pages, authored
  field notes, method/about pages, and JSON API routes.
- **Data**: JSON Schemas; labelled EPRV seed graph; curated source list.
- **Ingestion**: GitHub Search API and OpenAlex fetchers with caching, a
  normaliser, and transparent source attribution.
- **Deployment/metadata**: Open Graph image, favicon, robots, sitemap,
  `vercel.json`, `.env.example`.
- **Accessibility**: skip link, focus styles, reduced-motion support, and a
  textual fallback for the scene.
- **Docs**: architecture, methodology, scoring model, data sources, attribution,
  accessibility, performance, field notes, and launch materials.

### Notes

- The default snapshot is built from a clearly-labelled illustrative seed
  (`eprv-seed-…`); real snapshots from the ingestion pipeline are `eprv-…`.
- Scores are a transparent heuristic over public-signal proxies, not curated
  bibliometrics. See `docs/field-notes/scoring-limitations.md`.

[Unreleased]: https://github.com/Biswajit1999/adjacent-atlas/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Biswajit1999/adjacent-atlas/releases/tag/v0.1.0
