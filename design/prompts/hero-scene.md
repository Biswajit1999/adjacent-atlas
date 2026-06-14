# Hero scene — generation prompt

Reference for the look of the live hero preview (`HeroAtlasPreview`), useful when
producing a static fallback image.

> A small constellation of ~8 glowing nodes in a dark volume, gently rotating,
> sizes varying with importance, connected by faint teal lines. The brightest,
> largest nodes sit near the centre; smaller, dimmer ones drift outward. Additive
> glow on each point, soft circular falloff, no hard edges. Camera at a slight
> downward tilt. Mood: a quiet instrument readout, not a fireworks display.

The live version uses additive-blended points with per-point size from the
adjacency score and a slow idle rotation; match that restraint.
