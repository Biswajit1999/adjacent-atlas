# Versioning

Adjacent Atlas follows [Semantic Versioning 2.0.0](https://semver.org/).

- **MAJOR** — incompatible changes to a public contract: the snapshot JSON shape
  (`data/schemas`), the engine's exported types/functions, or the `@adjacent-atlas/*`
  package APIs.
- **MINOR** — backwards-compatible features (new scoring components behind
  defaults, new UI panels, new ingestion sources).
- **PATCH** — backwards-compatible fixes and docs.

## Pre-1.0

While the version is `0.x`, the public surface may still change between minor
versions. The data schemas and engine types are the most stable parts and are
treated with the most care.

## Where the version lives

- `package.json` (root) — the source of truth for the release number.
- `CITATION.cff` — `version` and `date-released`, kept in step for citation.
- `packages/engine` exposes `ENGINE_VERSION`, stamped onto every snapshot's
  `meta.engineVersion` so a snapshot records the engine that produced it.

The workspace packages (`engine`, `ui`, `embed`, `web`) currently share the
project version; if any package begins to be published independently, it can be
versioned on its own track from that point.

## Changelog

User-visible changes are recorded in `CHANGELOG.md` using the Keep a Changelog
format. Each release gets a dated section; unreleased work accumulates under
`[Unreleased]`.
