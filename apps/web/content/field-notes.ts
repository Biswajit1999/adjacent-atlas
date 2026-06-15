/**
 * Authored field notes — short, researcher-voice commentary that gives the
 * project a point of view. These are opinions and domain context, not data.
 * Notes with a `related` id are surfaced on that node's brief.
 */
export interface FieldNote {
  id: string;
  title: string;
  /** Optional node id this note speaks to. */
  related?: string;
  body: string[];
}

export const FIELD_NOTES: FieldNote[] = [
  {
    id: "fn-reading-the-atlas",
    title: "Reading the atlas",
    body: [
      "The atlas is meant to be read, not glanced at. A point's size is its adjacency score and its position drifts toward the centre as that score rises, but the number is only a starting question: why is this here, and what would change my mind?",
      "I find the opportunity radar more useful than the raw ranking. Adjacency rewards things that are already busy; the radar deliberately down-weights maturity so that quieter, younger techniques with room to grow are not buried under whatever is fashionable this year.",
    ],
  },
  {
    id: "fn-momentum-vs-importance",
    title: "Momentum is not importance",
    body: [
      "Everything here measures attention, not merit. A technique can be foundational and quiet, or noisy and going nowhere. The score conflates the two on purpose, because the question the tool asks is narrow: what is moving, and what sits one step beyond it?",
      "So treat a high score as a prompt to look closer, never as a verdict. The honest failure mode of this project is mistaking a search-engine echo for a real trend, and I would rather say that plainly than dress the numbers up.",
    ],
  },
  {
    id: "fn-seed-scaffolding",
    title: "The seed is scaffolding",
    body: [
      "Out of the box the graph runs on a small, hand-authored seed whose activity numbers are illustrative, not measured. It exists so the interface and the scoring have something concrete to render before any real ingestion has run.",
      "When the ingestion pipeline runs, the activity series and counts come from real public APIs (GitHub and OpenAlex) and the snapshot id changes from `eprv-seed-…` to `eprv-…`. The two are never mixed silently.",
    ],
  },
  {
    id: "fn-laser-frequency-comb",
    title: "On the laser frequency comb",
    related: "laser-frequency-comb",
    body: [
      "A laser frequency comb gives a spectrograph an absolute, repeatable wavelength ruler — a dense set of lines at known frequencies that does not drift the way emission lamps do. For sub-metre-per-second velocity work, calibration stability is often the thing that gates everything else.",
      "It scores well on connectivity here because calibration touches almost every other technique in the field. That is a real structural fact about the domain, not an artefact of the scoring.",
    ],
  },
  {
    id: "fn-stellar-activity",
    title: "On stellar activity",
    related: "stellar-activity-mitigation",
    body: [
      "Even with a perfect instrument, the star itself moves its own spectral lines: spots, plage, and granulation all imprint apparent velocity signals that can swamp a small planet. Mitigating stellar activity is less an instrument problem than a modelling one, which is why it sits among the methods rather than the instruments.",
      "It tends to show strong momentum because it is where a lot of current effort concentrates — the instruments have improved faster than our ability to disentangle the star.",
    ],
  },
];

export function fieldNoteFor(nodeId: string): FieldNote | undefined {
  return FIELD_NOTES.find((n) => n.related === nodeId);
}

export function generalFieldNotes(): FieldNote[] {
  return FIELD_NOTES.filter((n) => !n.related);
}
