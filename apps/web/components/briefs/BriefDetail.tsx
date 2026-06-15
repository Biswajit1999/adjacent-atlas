import type { AtlasNode, Brief, NodeScore } from "@adjacent-atlas/engine";
import { Tag } from "@adjacent-atlas/ui";
import { ScoreBreakdown } from "@/components/atlas/ScoreBreakdown";
import { kindVisual } from "@/lib/format";
import { fieldNoteFor } from "@/content/field-notes";

export interface BriefDetailProps {
  brief: Brief;
  node: AtlasNode | null;
  score: NodeScore | null;
}

export function BriefDetail({ brief, node, score }: BriefDetailProps): JSX.Element {
  const note = fieldNoteFor(brief.nodeId);
  const visual = node ? kindVisual(node.kind) : null;

  return (
    <article className="brief-detail">
      <a className="brief-detail__back" href="/briefs">
        ← All briefs
      </a>

      <header className="brief-detail__head">
        <div className="brief-detail__title-wrap">
          {visual ? <span className="brief-detail__dot" style={{ background: visual.color }} aria-hidden="true" /> : null}
          <h1 className="brief-detail__title">{brief.title}</h1>
        </div>
        <span className="brief-detail__adjacency mono">{brief.adjacency.toFixed(1)}</span>
      </header>

      {node ? (
        <div className="brief-detail__tags">
          <Tag label={kindVisual(node.kind).label} tone="accent" />
          {node.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      ) : null}

      <p className="brief-detail__thesis">{brief.thesis}</p>
      {node ? <p className="brief-detail__summary">{node.summary}</p> : null}

      {score ? (
        <section className="brief-detail__section">
          <h2>Score components</h2>
          <ScoreBreakdown breakdown={score.breakdown} />
        </section>
      ) : null}

      <section className="brief-detail__section">
        <h2>Signals</h2>
        <ul className="signal-list">
          {brief.signals.map((s) => (
            <li className="signal" key={s}>
              {s}
            </li>
          ))}
        </ul>
      </section>

      {note ? (
        <section className="brief-detail__note">
          <h2>Field note — {note.title}</h2>
          {note.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ) : null}

      <footer className="brief-detail__footer">
        <a href={`/atlas#${brief.nodeId}`}>View in the atlas →</a>
      </footer>

      <p className="note">
        The thesis restates what the node is; the score components are the same ones shown on the
        atlas. Field notes are authored commentary, not data.
      </p>
    </article>
  );
}
