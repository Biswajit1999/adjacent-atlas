import type { Metadata } from "next";
import { ScoreBar, Tag } from "@adjacent-atlas/ui";
import { getRanked, getSnapshot } from "@/lib/snapshot";
import { AtlasShell } from "@/components/atlas/AtlasShell";
import { kindVisual } from "@/lib/format";

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "An interactive 3D map of the field, with every node scored on momentum, recency, connectivity, novelty, and feasibility.",
};

export default function AtlasPage(): JSX.Element {
  const snapshot = getSnapshot();
  const ranked = getRanked();

  return (
    <section className="page container">
      <header className="page-header">
        <h1 className="page-title">Atlas</h1>
        <p className="page-intro">
          {ranked.length} nodes in {snapshot.meta.domain}, ranked by adjacency. Drag to rotate,
          scroll to zoom, click a point to inspect it. The ranked list carries the same scores for
          close reading. Source window{" "}
          <span className="mono">
            {snapshot.meta.sourceWindow.from} → {snapshot.meta.sourceWindow.to}
          </span>
          .
        </p>
      </header>

      <AtlasShell initialSnapshot={snapshot} />

      {/* No-JavaScript fallback: the full ranked list, server-rendered. */}
      <noscript>
        <div className="stack" style={{ marginTop: 32 }}>
          {ranked.map((entry, index) => (
            <article className="entry" id={entry.node.id} key={entry.node.id}>
              <div className="entry__rank">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="entry__head">
                  <h2 className="entry__title">{entry.node.label}</h2>
                  <Tag label={kindVisual(entry.node.kind).label} tone="accent" />
                </div>
                <p className="entry__summary">{entry.node.summary}</p>
                <ScoreBar value={entry.score.adjacency} label="adjacency" />
              </div>
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
