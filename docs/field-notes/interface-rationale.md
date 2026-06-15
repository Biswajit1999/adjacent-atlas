# Field notes — interface rationale

## Why a 3D field at all

A ranked list answers "what scores highest". A graph answers "what sits near
what". The 3D field exists for the second question: calibration techniques
cluster because calibration couples to everything; a stranded node is visibly
stranded. The layout pulls high-adjacency nodes toward the centre so the eye
starts where the activity is, then follows the edges outward.

## Encoding

- **Colour = kind.** Six distinguishable hues on a dark field, chosen to stay
  legible at small point sizes.
- **Size and opacity = adjacency.** Bigger and brighter means higher score.
- **Distance to centre = inverse adjacency.** A spatial echo of the size cue, so
  the ranking is readable even before you read a label.
- **Line opacity = relationship weight.** Subtle on purpose; the nodes are the
  subject, the edges are context.

## The opportunity radar

Adjacency rewards what is already busy. The radar re-weights toward momentum,
novelty, and feasibility — the forward-looking trio — to surface candidates that
the headline ranking buries. It is the same data viewed through a different
question: not "what is loud now" but "what is reachable next".

## Search and filters

Search and filters intersect: filtering by kind and then searching a tag narrows
both the scene and the list together. Unmatched nodes dim rather than disappear,
so the structure stays visible while the focus shifts.

## What the interface refuses to do

No autoplaying camera moves, no parallax, no number that animates upward for
drama. The most important affordance is that every score can be opened and read
component by component.
