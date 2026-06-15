# Methodology

Adjacent Atlas answers one question: within a field, which methods, instruments,
and concepts are *adjacent* to the current frontier — close enough to be the
next thing worked on — and which of those already have momentum?

## What counts as a signal

Two public signal sources:

- **Code activity** — commits, releases, and mentions across open-source
  repositories associated with a technique.
- **Literature** — appearances and citations in the published record.

These are normalised into a graph of nodes (concepts, methods, instruments,
datasets, implementations, results) connected by weighted edges (relates,
depends, cites, implements, supersedes).

## What "adjacency" means here

Adjacency is not novelty alone, nor popularity alone. It is a deliberate blend:
something is adjacent when it is *moving* (momentum, recency), *connected* to the
rest of the field (connectivity), *not yet saturated* (novelty), and *buildable*
(feasibility). The scoring model in `docs/scoring-model.md` makes this concrete.

## The reference domain

The shipped graph is extreme-precision radial velocity (EPRV) instrumentation.
It was chosen because progress there is gated by instrument systematics as much
as by ideas, so the difference between "interesting" and "reachable" is sharp.

## Honesty about the seed

The bundled seed's `signals` values (activity series, implementation counts,
maturity) are illustrative scaffolding that exercise the model across a realistic
range. They are not measured statistics. Live snapshots replace them with values
from the fetch scripts.


## Reading the scores honestly

The scoring is a transparent heuristic, and its boundary matters as much as its
output. The honest limitations — attention versus merit, proxy noise, the
subjectivity of the weights, and the absence of any predictive claim — are set
out in [`field-notes/scoring-limitations.md`](./field-notes/scoring-limitations.md).

## Field notes

Authored, researcher-voice context lives alongside this document:

- [Why EPRV instrumentation is the seed domain](./field-notes/eprv-domain-notes.md)
- [Design decisions](./field-notes/design-decisions.md) and
  [interface rationale](./field-notes/interface-rationale.md)
- [Limitations of the scoring](./field-notes/scoring-limitations.md)

These are commentary, not data. The seed's activity numbers are illustrative;
real snapshots come from the ingestion pipeline (`docs/data-sources.md`).
