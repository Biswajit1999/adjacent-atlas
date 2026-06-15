import type { Metadata } from "next";
import { getBriefs, getSnapshot } from "@/lib/snapshot";
import { BriefGrid } from "@/components/briefs/BriefGrid";
import { generalFieldNotes } from "@/content/field-notes";

export const metadata: Metadata = {
  title: "Briefs",
  description:
    "Short, sourced notes on the highest-adjacency nodes — what each one is and why it ranks.",
};

export default function BriefsPage(): JSX.Element {
  const snapshot = getSnapshot();
  const briefs = getBriefs();
  const notes = generalFieldNotes();

  return (
    <section className="page container">
      <header className="page-header">
        <h1 className="page-title">Briefs</h1>
        <p className="page-intro">
          One note per node, generated from the same scores that drive the atlas. The thesis line
          restates what the node is; the chips below it are the signals behind its ranking. Nothing
          here is asserted beyond what the data records.
        </p>
      </header>

      <BriefGrid briefs={briefs} />

      {notes.length > 0 ? (
        <section className="field-notes-section">
          <h2 className="field-notes-section__title">Field notes</h2>
          <div className="field-notes">
            {notes.map((n) => (
              <article className="field-note" key={n.id}>
                <h3>{n.title}</h3>
                <p>{n.body[0]}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <p className="note">
        Briefs follow snapshot <span className="mono">{snapshot.meta.id}</span>. They are
        regenerated whenever a new snapshot is built.
      </p>
    </section>
  );
}
