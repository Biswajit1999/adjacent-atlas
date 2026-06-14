export const SITE = {
  name: "Adjacent Atlas",
  tagline: "An observatory for the adjacent possible",
  description:
    "Methods, instruments, and concepts close to the frontier of a research field, ranked from public code and literature signals.",
  domain: "extreme-precision radial velocity instrumentation",
  repoUrl: "https://github.com/biswajitj998/adjacent-atlas",
  author: {
    name: "Biswajit Jana",
    handle: "biswajitj998",
    url: "https://github.com/biswajitj998",
  },
  year: 2026,
} as const;

export const HOME = {
  eyebrow: "An observatory for the adjacent possible",
  title: "The frontier, and what sits one step beyond it.",
  lede:
    "Adjacent Atlas reads public signals — code activity and literature — and ranks the methods, instruments, and concepts close enough to a field's frontier to be worked on next. The reference map is extreme-precision radial velocity instrumentation.",
  primary: { href: "/atlas", label: "Open the atlas" },
  secondary: { href: "/method", label: "How it scores" },
} as const;

export const METHOD = {
  intro:
    "The score is deliberately simple and inspectable. Each node is reduced to five normalised components, combined as a weighted mean, and scaled to 0–100. No model is trained; nothing is hidden.",
  honesty:
    "This is a transparent heuristic, not a prediction. It encodes a point of view about what makes something worth looking at next — recent movement, real connections, room to grow — and it lets you change that point of view by changing the weights.",
} as const;

export const ABOUT = {
  paragraphs: [
    "Adjacent Atlas is a small instrument for a specific question: given a research field, what is reachable next, and which of those options already have momentum behind them?",
    "The shipped map is extreme-precision radial velocity (EPRV) instrumentation — the calibration sources, environmental control, and data-reduction methods that push a spectrograph toward sub-metre-per-second velocity precision. It is a domain where progress is gated as much by instrument systematics as by ideas, which makes adjacency a useful lens.",
    "The node summaries describe each technique factually. The activity series, implementation counts, and maturity figures in the bundled seed are illustrative scaffolding, chosen to exercise the scoring model across a realistic range. They are not measured statistics and should not be cited as such. Live snapshots are produced from real signals by the fetch-and-build scripts.",
    "The scoring is transparent on purpose. Anyone should be able to read a ranking and see why a node sits where it does, then disagree with the weighting and change it. The interface is built to be read closely rather than glanced at — closer to an observatory console than a dashboard.",
  ],
} as const;
