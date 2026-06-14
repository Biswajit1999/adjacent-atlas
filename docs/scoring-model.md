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
