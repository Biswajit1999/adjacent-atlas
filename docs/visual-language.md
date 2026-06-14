# Visual language

Adjacent Atlas should read like an observatory console, not a SaaS dashboard.

## Principles

- **Dark, calm, scientific.** A near-black field with faint teal/green wash.
  Colour is information, not decoration.
- **Information hierarchy first.** Type size and weight carry the structure;
  borders and surfaces are quiet.
- **Restrained motion.** A slow idle rotation and a gentle selection pulse —
  nothing that competes with reading.
- **Legible at a glance, rewarding on inspection.** The atlas is understandable
  with the seed graph, and the inspector rewards a closer look.

## Encoding in the 3D atlas

| Channel        | Meaning                          |
| -------------- | -------------------------------- |
| Point colour   | node kind                        |
| Point size     | adjacency score                  |
| Point opacity  | adjacency (and filter state)     |
| Distance to centre | inverse adjacency (strong nodes settle inward) |
| Line           | relationship, opacity ∝ weight   |

## Colour by kind

| Kind          | Hex       |
| ------------- | --------- |
| concept       | `#5eead4` |
| method        | `#7aa2f7` |
| instrument    | `#f5a97f` |
| dataset       | `#c3a6ff` |
| implementation (repo) | `#9ece6a` |
| result (paper) | `#f7768e` |

Token values live in `packages/ui/src/tokens` and `apps/web/lib/format.ts`
(kind colours), and `design/tokens` documents the intent.
