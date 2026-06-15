import {
  degreeStats,
  opportunityRanking,
  scoreHistogram,
  scoreSummary,
  topTags,
  type HistogramBin,
  type OpportunityEntry,
  type TagCount,
} from "@adjacent-atlas/engine";
import type { AtlasNode, AtlasSnapshot, NodeKind } from "@adjacent-atlas/engine";

export interface AtlasStats {
  nodeCount: number;
  edgeCount: number;
  density: number;
  meanDegree: number;
  isolatedCount: number;
  topTags: TagCount[];
  score: { min: number; max: number; mean: number; median: number };
  histogram: HistogramBin[];
}

/** Whole-graph descriptive statistics for the stats panel. */
export function computeStats(snapshot: AtlasSnapshot): AtlasStats {
  const degree = degreeStats(snapshot.nodes, snapshot.edges);
  const summary = scoreSummary(snapshot.scores);
  return {
    nodeCount: degree.nodeCount,
    edgeCount: degree.edgeCount,
    density: degree.density,
    meanDegree: degree.meanDegree,
    isolatedCount: degree.isolatedCount,
    topTags: topTags(snapshot.nodes, 8),
    score: { min: summary.min, max: summary.max, mean: summary.mean, median: summary.median },
    histogram: scoreHistogram(snapshot.scores, 10),
  };
}

export interface OpportunityRow extends OpportunityEntry {
  label: string;
  kind: NodeKind;
}

/** Highest forward-looking (momentum/novelty/feasibility) nodes, with labels. */
export function opportunities(snapshot: AtlasSnapshot, limit = 5): OpportunityRow[] {
  const nodeById = new Map(snapshot.nodes.map((n) => [n.id, n]));
  return opportunityRanking(snapshot.scores, limit).map((entry) => {
    const node = nodeById.get(entry.nodeId);
    return { ...entry, label: node?.label ?? entry.nodeId, kind: node?.kind ?? "concept" };
  });
}

export interface TimelinePoint {
  period: string;
  value: number;
}

/** Aggregate activity across all nodes, by period, oldest first. */
export function activityTimeline(nodes: AtlasNode[]): TimelinePoint[] {
  const totals = new Map<string, number>();
  for (const node of nodes) {
    for (const point of node.signals.activity) {
      totals.set(point.period, (totals.get(point.period) ?? 0) + point.value);
    }
  }
  return [...totals.entries()]
    .map(([period, value]) => ({ period, value }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Node ids matching a free-text query against label, id, or tags. Returns null
 * for an empty query (meaning "no search filter applied").
 */
export function searchNodes(nodes: AtlasNode[], query: string): Set<string> | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const matches = new Set<string>();
  for (const node of nodes) {
    const haystack = `${node.label} ${node.id} ${node.tags.join(" ")}`.toLowerCase();
    if (haystack.includes(q)) matches.add(node.id);
  }
  return matches;
}
