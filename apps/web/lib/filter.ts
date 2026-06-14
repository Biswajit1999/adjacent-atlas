import type { AtlasNode, AtlasSnapshot, NodeKind, NodeScore } from "@adjacent-atlas/engine";

export interface RankedEntry {
  node: AtlasNode;
  score: NodeScore;
}

/** Pair each node with its score, highest adjacency first. */
export function rankEntries(snapshot: AtlasSnapshot): RankedEntry[] {
  const nodeById = new Map(snapshot.nodes.map((n) => [n.id, n]));
  const entries: RankedEntry[] = [];
  for (const score of [...snapshot.scores].sort((a, b) => b.adjacency - a.adjacency)) {
    const node = nodeById.get(score.nodeId);
    if (node) entries.push({ node, score });
  }
  return entries;
}

export interface FilterState {
  /** Active kinds; an empty array means "all kinds". */
  kinds: NodeKind[];
  /** Minimum adjacency, 0..100. */
  minScore: number;
  /** A single required tag, or null for "any tag". */
  tag: string | null;
}

export const DEFAULT_FILTER: FilterState = { kinds: [], minScore: 0, tag: null };

export function collectKinds(nodes: AtlasNode[]): NodeKind[] {
  const set = new Set<NodeKind>();
  for (const n of nodes) set.add(n.kind);
  return [...set];
}

export function collectTags(nodes: AtlasNode[]): string[] {
  const set = new Set<string>();
  for (const n of nodes) for (const t of n.tags) set.add(t);
  return [...set].sort();
}

export function matchesFilter(entry: RankedEntry, filter: FilterState): boolean {
  if (filter.kinds.length > 0 && !filter.kinds.includes(entry.node.kind)) return false;
  if (entry.score.adjacency < filter.minScore) return false;
  if (filter.tag && !entry.node.tags.includes(filter.tag)) return false;
  return true;
}

export function applyFilter(entries: RankedEntry[], filter: FilterState): RankedEntry[] {
  return entries.filter((entry) => matchesFilter(entry, filter));
}

export function visibleIdSet(entries: RankedEntry[], filter: FilterState): Set<string> {
  return new Set(applyFilter(entries, filter).map((entry) => entry.node.id));
}

export function isFilterActive(filter: FilterState): boolean {
  return filter.kinds.length > 0 || filter.minScore > 0 || filter.tag !== null;
}
