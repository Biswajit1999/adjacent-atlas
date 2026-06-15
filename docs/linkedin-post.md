# LinkedIn launch post

A draft in a measured, first-person research voice. Edit before posting; do not
add metrics that are not real (no "X stars", no "used by", no fabricated praise).

---

I built a small tool to answer a question I kept asking myself: in a research
field, what is *reachable next* — and which of those options already have
momentum behind them?

It's called **Adjacent Atlas**. It reads public signals (open-source activity
and literature) and ranks the methods, instruments, and concepts that sit one
step beyond the current frontier, then renders them as an interactive 3D map.

I seeded it with the domain I know best: **extreme-precision radial velocity
(EPRV) instrumentation** — the calibration, stability, and data-reduction
techniques that push a spectrograph below a metre per second. It's a field where
progress is gated by instrument systematics as much as by ideas, which makes the
gap between "interesting" and "reachable" unusually sharp.

A few decisions I care about:

• The score is a transparent heuristic — momentum, recency, connectivity,
  novelty, feasibility — not a black box. You can read why any node sits where it
  does, and disagree with the weighting.

• It's honest about its own limits. The default graph is a clearly-labelled seed;
  real snapshots come from a caching ingestion pipeline over the GitHub and
  OpenAlex APIs. It measures attention, not merit, and it says so.

• It's engineered, not mocked up: a typed scoring engine with tests, a
  deterministic worker-driven layout, and a dark, read-closely interface that
  yields to reduced-motion.

It's early (v0.1.0) and the roadmap is open — snapshot history, larger graphs,
more domains. Code and write-ups are on GitHub:
https://github.com/Biswajit1999/adjacent-atlas

Built with TypeScript, Next.js, and Three.js. Feedback from both the software and
the instrumentation side is very welcome.

#exoplanets #instrumentation #radialvelocity #datavisualization #opensource

---

## Notes for editing

- Swap in a real screenshot or the generated social card as the post image.
- If you have a live deployment, add the URL near the GitHub link.
- Keep the tone factual; the post should read like you, not like marketing.
