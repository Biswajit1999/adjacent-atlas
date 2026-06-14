import type {
  AtlasEdge,
  AtlasNode,
  AtlasSnapshot,
  NodeScore,
  SnapshotMeta,
} from "../types/index.js";
import { scoreSnapshot, type ScoreOptions } from "../scoring/score.js";

/** Stamped onto every snapshot so consumers can detect model changes. */
export const ENGINE_VERSION = "0.1.0";

export interface BuildSnapshotInput {
  id: string;
  domain: string;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  sourceWindow: { from: string; to: string };
  /** Generation time; also used as the reference time for scoring. */
  generatedAt?: Date;
  scoreOptions?: ScoreOptions;
}

/**
 * Score a graph and assemble a complete, serialisable snapshot. The scoring
 * reference time is pinned to `generatedAt` so a snapshot is reproducible.
 */
export function buildSnapshot(input: BuildSnapshotInput): AtlasSnapshot {
  const generatedAt = input.generatedAt ?? new Date();

  const scores: NodeScore[] = scoreSnapshot(input.nodes, input.edges, {
    ...input.scoreOptions,
    now: generatedAt,
  });

  const meta: SnapshotMeta = {
    id: input.id,
    generatedAt: generatedAt.toISOString(),
    domain: input.domain,
    sourceWindow: input.sourceWindow,
    nodeCount: input.nodes.length,
    edgeCount: input.edges.length,
    engineVersion: ENGINE_VERSION,
  };

  return { meta, nodes: input.nodes, edges: input.edges, scores };
}

/** Serialise a snapshot to JSON. Pretty-printed by default for diff-friendliness. */
export function serializeSnapshot(snapshot: AtlasSnapshot, pretty = true): string {
  return JSON.stringify(snapshot, null, pretty ? 2 : 0);
}

/** Parse a snapshot from JSON. The caller is responsible for validation. */
export function deserializeSnapshot(json: string): AtlasSnapshot {
  return JSON.parse(json) as AtlasSnapshot;
}
