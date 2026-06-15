# Social card — generation prompt

The repository ships a generated SVG card (`pnpm.cmd social-card` →
`apps/web/public/social/card.svg`) built from the current snapshot with real
ranked nodes. This prompt is for an alternative, hand-made 1200×630 image when
you want something more pictorial than the data card.

> A 1200×630 open-graph image, near-black (#0b0f14) with a faint teal upper-right
> wash. Upper-left: "Adjacent Atlas" wordmark in white Inter 600 with a small
> teal rounded-square mark; beneath it the tagline "The frontier, and what sits
> one step beyond it." in lighter weight. Lower band: a row of six glowing dots
> in the kind palette (teal #5eead4, blue #7aa2f7, amber #f5a97f, violet #c3a6ff,
> green #9ece6a, rose #f7768e), with thin connecting lines suggesting a graph.
> Calm, scientific, generous negative space. No fake UI, no numbers presented as
> real measurements.

Prefer the generated `card.svg` for accuracy; use this only for a stylised
variant. Save to `apps/web/public/social/`.
