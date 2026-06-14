import type { AtlasSnapshot } from "@adjacent-atlas/engine";
import { Panel, ScoreBar, Tag, colors } from "@adjacent-atlas/ui";
import { rankSnapshot } from "./index.js";

export interface AdjacentAtlasEmbedProps {
  snapshot: AtlasSnapshot;
  /** Number of nodes to show. Defaults to 8. */
  limit?: number;
  title?: string;
}

/**
 * A self-contained ranked view of a snapshot, suitable for embedding on a
 * third-party page. Depends only on the engine and the UI primitives, both of
 * which are bundled at build time.
 */
export function AdjacentAtlasEmbed({
  snapshot,
  limit = 8,
  title = "Adjacent Atlas",
}: AdjacentAtlasEmbedProps): JSX.Element {
  const ranked = rankSnapshot(snapshot, limit);

  return (
    <Panel title={title} style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ranked.map((node) => (
          <div key={node.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ color: colors.text, fontSize: 14 }}>{node.label}</span>
              <Tag label={node.kind} />
            </div>
            <ScoreBar value={node.adjacency} />
          </div>
        ))}
      </div>
      <p style={{ color: colors.muted, fontSize: 11, marginTop: 16, marginBottom: 0 }}>
        Ranked by adjacency · {snapshot.meta.domain}
      </p>
    </Panel>
  );
}
