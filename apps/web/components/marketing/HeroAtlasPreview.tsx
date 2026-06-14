"use client";

import { useMemo } from "react";
import type { AtlasSnapshot, NodeScore } from "@adjacent-atlas/engine";
import { AtlasScene } from "@/components/atlas/AtlasScene";
import { runLayoutSync } from "@/lib/layout";

export interface HeroAtlasPreviewProps {
  snapshot: AtlasSnapshot;
}

export function HeroAtlasPreview({ snapshot }: HeroAtlasPreviewProps): JSX.Element {
  const positions = useMemo(
    () =>
      runLayoutSync({
        type: "layout:request",
        nodes: snapshot.nodes,
        edges: snapshot.edges,
        options: {
          iterations: 220,
          dimensions: 3,
          scores: Object.fromEntries(snapshot.scores.map((s) => [s.nodeId, s.adjacency])),
        },
      }),
    [snapshot],
  );

  const scoreById = useMemo(() => {
    const record: Record<string, NodeScore> = {};
    for (const score of snapshot.scores) record[score.nodeId] = score;
    return record;
  }, [snapshot]);

  return (
    <div className="hero-preview">
      <AtlasScene
        nodes={snapshot.nodes}
        edges={snapshot.edges}
        scoreById={scoreById}
        positions={positions}
        selectedId={null}
        onSelect={() => undefined}
        height={420}
      />
    </div>
  );
}
