import type { AtlasEdge, AtlasNode } from "../types/index.js";

/** A neighbouring node reached via a specific edge. */
export interface Neighbor {
  nodeId: string;
  edge: AtlasEdge;
}

/**
 * An undirected adjacency view over the atlas. Edges are directed in the data
 * model but, for connectivity and neighbour queries, are treated as
 * bidirectional links. Construction is O(V + E); all lookups are O(1) or
 * proportional to a node's degree.
 */
export class AtlasGraph {
  readonly nodes: readonly AtlasNode[];
  readonly edges: readonly AtlasEdge[];

  private readonly nodeMap: Map<string, AtlasNode>;
  private readonly adjacency: Map<string, Neighbor[]>;

  constructor(nodes: readonly AtlasNode[], edges: readonly AtlasEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeMap = new Map(nodes.map((n) => [n.id, n]));
    this.adjacency = new Map(nodes.map((n) => [n.id, [] as Neighbor[]]));

    for (const edge of edges) {
      this.link(edge.source, { nodeId: edge.target, edge });
      this.link(edge.target, { nodeId: edge.source, edge });
    }
  }

  private link(nodeId: string, neighbor: Neighbor): void {
    const list = this.adjacency.get(nodeId);
    if (list) list.push(neighbor);
  }

  has(nodeId: string): boolean {
    return this.nodeMap.has(nodeId);
  }

  node(nodeId: string): AtlasNode | undefined {
    return this.nodeMap.get(nodeId);
  }

  neighbors(nodeId: string): Neighbor[] {
    return this.adjacency.get(nodeId) ?? [];
  }

  /** Number of incident edges. */
  degree(nodeId: string): number {
    return this.neighbors(nodeId).length;
  }

  /** Sum of incident edge weights. */
  weightedDegree(nodeId: string): number {
    let total = 0;
    for (const n of this.neighbors(nodeId)) total += n.edge.weight;
    return total;
  }

  /** Nodes with no incident edges. */
  isolated(): AtlasNode[] {
    return this.nodes.filter((n) => this.degree(n.id) === 0);
  }
}

/** Convenience constructor. */
export function buildGraph(
  nodes: readonly AtlasNode[],
  edges: readonly AtlasEdge[],
): AtlasGraph {
  return new AtlasGraph(nodes, edges);
}

/**
 * Structural checks on a node/edge set. Returns a list of human-readable
 * problems; an empty array means the graph is well-formed.
 */
export function validateEdges(
  nodes: readonly AtlasNode[],
  edges: readonly AtlasEdge[],
): string[] {
  const ids = new Set(nodes.map((n) => n.id));
  const seen = new Set<string>();
  const problems: string[] = [];

  for (const e of edges) {
    if (seen.has(e.id)) problems.push(`duplicate edge id: ${e.id}`);
    seen.add(e.id);
    if (!ids.has(e.source)) problems.push(`edge ${e.id} references unknown source: ${e.source}`);
    if (!ids.has(e.target)) problems.push(`edge ${e.id} references unknown target: ${e.target}`);
    if (e.source === e.target) problems.push(`edge ${e.id} is a self-loop`);
  }

  return problems;
}
