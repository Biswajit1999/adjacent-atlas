# Typography

## Families

- **Sans:** Inter, with a system fallback stack. UI and prose.
- **Mono:** JetBrains Mono, with a system mono fallback. Identifiers, scores,
  periods, and anything that benefits from tabular alignment.

The app does not bundle web fonts; it uses the families if present and falls back
gracefully, which keeps the first render fast and dependency-free.

## Scale

| Token | px  | Use                         |
| ----- | --- | --------------------------- |
| xs    | 12  | Captions, chips, eyebrows   |
| sm    | 14  | Body small, controls        |
| base  | 16  | Body                        |
| lg    | 20  | Section headings            |
| xl    | 28  | Page titles                 |
| xxl   | 40+ | Hero title                  |

## Rules

- Eyebrows are mono, uppercase, letter-spaced.
- Numeric values (scores, weights, ids, dates) are mono.
- Line length in prose is capped around 70–74ch.
