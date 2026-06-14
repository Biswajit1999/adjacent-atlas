# Roadmap

Status: `0.1.0`, early development. The engine scoring model and data schemas
are stable enough to build on; the live fetch pipeline and synthesis layer are
the active edges.

## Near term

- Real fetch implementations for `scripts/fetch-github.ts` and
  `scripts/fetch-papers.ts`, writing normalised nodes/edges.
- Snapshot history: keep multiple dated snapshots and diff them.
- A "drift" view: how a node's adjacency moves across snapshots
  (`docs/paper-drift.md`).

## Medium term

- Barnes–Hut approximation in the layout for graphs beyond a few hundred nodes.
- Per-snapshot weight presets, surfaced in the UI.
- Saved views (filters + selection) encoded in the URL.

## Longer term

- Additional reference domains beyond EPRV instrumentation.
- An authored-overrides layer so a maintainer can annotate or pin nodes.
- Embeddable scene (not just the ranked list) for personal sites.

Nothing here is promised by a date; this is the intended direction of travel.
