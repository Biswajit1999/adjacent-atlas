import type { AtlasNode, Brief, NodeScore } from "../types/index.js";

export interface BriefOptions {
  /** Timestamp recorded on the brief. Defaults to `new Date()`. */
  now?: Date;
}

const KIND_LEAD: Record<string, string> = {
  concept: "An emerging concept",
  method: "A method",
  instrument: "An instrument",
  dataset: "A dataset",
  repo: "An implementation",
  paper: "A result",
};

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/** The two highest sub-scores, named, used to explain a node's ranking. */
function topDrivers(score: NodeScore, count = 2): string[] {
  return Object.entries(score.breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => key);
}

/**
 * Produce a short, deterministic brief for a node from its score. The thesis
 * is templated from the node's own summary plus its scoring drivers — no text
 * is invented beyond what the data states.
 */
export function synthesizeBrief(
  node: AtlasNode,
  score: NodeScore,
  options: BriefOptions = {},
): Brief {
  const now = options.now ?? new Date();
  const drivers = topDrivers(score);
  const lead = KIND_LEAD[node.kind] ?? "A node";

  const thesis =
    `${lead} scoring ${score.adjacency} on adjacency, driven chiefly by ` +
    `${drivers.join(" and ")}. ${node.summary}`;

  const signals = [
    `Adjacency ${score.adjacency}/100`,
    `Momentum ${round2(score.breakdown.momentum)}`,
    `Connectivity ${round2(score.breakdown.connectivity)}`,
    `Recency ${round2(score.breakdown.recency)}`,
    `Last active ${node.signals.lastActiveAt}`,
    `${node.signals.implementations} public implementation(s)`,
  ];

  return {
    id: `brief-${node.id}`,
    nodeId: node.id,
    title: node.label,
    thesis,
    signals,
    adjacency: score.adjacency,
    generatedAt: now.toISOString(),
  };
}

/** Synthesise briefs for every node that has a matching score. */
export function synthesizeBriefs(
  nodes: readonly AtlasNode[],
  scores: readonly NodeScore[],
  options: BriefOptions = {},
): Brief[] {
  const scoreById = new Map(scores.map((s) => [s.nodeId, s]));
  const briefs: Brief[] = [];
  for (const node of nodes) {
    const score = scoreById.get(node.id);
    if (score) briefs.push(synthesizeBrief(node, score, options));
  }
  return briefs;
}
