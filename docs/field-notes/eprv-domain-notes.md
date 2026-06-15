# Field notes — why EPRV instrumentation is the seed domain

The seed graph maps extreme-precision radial velocity (EPRV) instrumentation:
the techniques that let a spectrograph measure a star's line-of-sight velocity to
below a metre per second, the regime needed to detect small planets by the tiny
reflex wobble they induce on their host star.

## What the domain is, briefly

A high-resolution spectrograph disperses starlight and measures how far spectral
lines shift. At the precision EPRV needs, the limiting factors are rarely the
idea and almost always the systematics:

- **Calibration** — knowing the wavelength scale absolutely and repeatably
  (laser frequency combs, Fabry-Pérot etalons).
- **Stability** — holding the instrument still against thermal, mechanical, and
  pressure changes (vacuum enclosures, thermal control, fiber scrambling).
- **The star and the atmosphere** — removing Earth's telluric absorption, and
  separating real planetary signals from the star's own surface activity.

## Why it suits an "adjacency" tool

EPRV is a field where progress is gated by instrument systematics as much as by
ideas, so the gap between *interesting* and *reachable* is unusually sharp. The
techniques are tightly coupled — calibration touches stability touches
data-reduction — which makes a graph the natural representation. And the
frontier moves in identifiable steps: a better calibrator, a quieter enclosure, a
sharper activity diagnostic. That is exactly the shape the tool is built to read.

## Why these seven nodes

The seed is intentionally small and legible: a couple of calibrators, a couple of
stability methods, two data-reduction methods, and one diagnostic. It is enough
to make the encoding and the scoring meaningful without pretending to be a
survey. A real snapshot, built from the ingestion pipeline, is wider and changes
over time; the seed is the fixed, readable starting point.

## A caveat from inside the field

The node summaries are factual and deliberately plain. The *scores* on the seed
are driven by illustrative activity numbers, not measurements — see
`docs/data-sources.md`. Nothing here should be cited as a statement about the
real state of any of these techniques.
