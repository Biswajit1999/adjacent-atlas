import {
  scoreSnapshot,
  type AtlasSnapshot,
  type NodeScore,
} from "@adjacent-atlas/engine";

/** A minimal, render-ready ranking row for the embed. */
export interface RankedNode {
  id: string;
  label: string;
  kind: string;
  adjacency: number;
}

/**
 * Reduce a full snapshot to the top-`limit` nodes by adjacency. If the
 * snapshot already carries scores they are used as-is; otherwise the engine
 * scores it on the fly so the embed works against raw graphs too.
 */
export function rankSnapshot(snapshot: AtlasSnapshot, limit = 10): RankedNode[] {
  const scores: NodeScore[] =
    snapshot.scores.length > 0
      ? snapshot.scores
      : scoreSnapshot(snapshot.nodes, snapshot.edges);

  const nodeById = new Map(snapshot.nodes.map((n) => [n.id, n]));

  return [...scores]
    .sort((a, b) => b.adjacency - a.adjacency)
    .slice(0, Math.max(0, limit))
    .map((s) => {
      const node = nodeById.get(s.nodeId);
      return {
        id: s.nodeId,
        label: node?.label ?? s.nodeId,
        kind: node?.kind ?? "concept",
        adjacency: s.adjacency,
      };
    });
}

export { AdjacentAtlasEmbed, type AdjacentAtlasEmbedProps } from "./AdjacentAtlasEmbed.js";
