# Scoring model

Every node receives an **adjacency** score in 0–100, computed as a weighted mean
of five components, each normalised to 0–1.

```
adjacency = 100 × ( w_m·momentum + w_r·recency + w_c·connectivity
                    + w_n·novelty + w_f·feasibility )
```

Weights are normalised to sum to 1. Defaults (`DEFAULT_WEIGHTS`):

| Component     | Weight |
| ------------- | ------ |
| momentum      | 30%    |
| recency       | 20%    |
| connectivity  | 20%    |
| novelty       | 15%    |
| feasibility   | 15%    |

## Components

**Momentum** — the windowed sum of recent activity divided by the previous
window, smoothed by `+1` and passed through a logistic of the log-ratio. Flat
activity reads 0.5; sustained growth approaches 1; decline approaches 0.

**Recency** — `0.5 ^ (ageDays / halfLifeDays)`, with a 180-day half-life by
default. Activity today reads ~1; one half-life old reads 0.5.

**Connectivity** — a node's total incident edge weight divided by the largest
weighted degree in the graph. Hubs approach 1; isolated nodes read 0.

**Novelty** — `0.5 ^ (maturityYears / halfLifeYears)`, with a 4-year half-life.
Newer entities score higher.

**Feasibility** — `1 − e^(−implementations / saturation)`, saturating at 5
implementations by default. Zero implementations read 0.

## Properties

The model is **transparent** (every component is inspectable on the atlas and in
each brief), **deterministic** (a snapshot pinned to its `generatedAt` reproduces
exactly — `scripts/validate-snapshot.ts` checks this), and **tunable** (weights
are passed through `ScoreOptions`).

It is a heuristic, not a predictor. It encodes a defensible point of view about
what is worth looking at next; changing the weights changes that view.


## Limitations

The score is a useful lens and a blunt instrument. In short:

- It measures **attention, not merit** — a high score is a prompt to look
  closer, never a verdict.
- The inputs are **coarse public-signal proxies** (repository and keyword-search
  counts), not curated bibliometrics, and must not be read as citation counts.
- The **weights are a point of view**; change them and the ranking changes.
- The seed **graph is small and authored**, so connectivity is sensitive to a
  few hand-set edges.
- There is **no causal or predictive claim** — opportunity means young, moving,
  and buildable by the proxies above, nothing more.

A fuller version is in
[`field-notes/scoring-limitations.md`](./field-notes/scoring-limitations.md).
