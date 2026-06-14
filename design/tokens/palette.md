# Palette

Canonical values live in `packages/ui/src/tokens/index.ts` and (for kind colours)
`apps/web/lib/format.ts`. This file documents intent.

## Surfaces

| Token            | Hex       | Use                                   |
| ---------------- | --------- | ------------------------------------- |
| `bg`             | `#0b0f14` | Page background                       |
| `surface`        | `#121822` | Cards, panels                         |
| `surfaceRaised`  | `#19212d` | Inputs, chips, meter tracks           |
| `border`         | `#1f2a37` | Hairlines and dividers                |

## Text

| Token   | Hex       | Use                  |
| ------- | --------- | -------------------- |
| `text`  | `#e6edf3` | Primary text         |
| `muted` | `#8b98a9` | Secondary text       |

## Accents

| Token         | Hex       | Use                          |
| ------------- | --------- | ---------------------------- |
| `accent`      | `#5eead4` | Primary accent, meters, glow |
| `accentMuted` | `#2c7a73` | Edges, quiet accents         |
| `warn`        | `#f5a97f` | Warnings                     |

## Kind colours

concept `#5eead4` · method `#7aa2f7` · instrument `#f5a97f` ·
dataset `#c3a6ff` · implementation `#9ece6a` · result `#f7768e`

Each kind colour is distinguishable at small point sizes on the dark field and
avoids pure primaries.
