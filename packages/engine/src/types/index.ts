/**
 * Core data model for Adjacent Atlas.
 *
 * These types are the single source of truth shared by the engine, the web
 * app, the embed, and the JSON Schemas under `data/schemas`. Keep the two in
 * sync when either changes.
 */

/** The kind of entity a node represents. */
export type NodeKind =
  | "concept"
  | "method"
  | "instrument"
  | "dataset"
  | "repo"
  | "paper";

/** The kind of relationship an edge represents. */
export type EdgeKind =
  | "relates"
  | "depends"
  | "cites"
  | "implements"
  | "supersedes";

/** A single time-bucketed activity measurement. */
export interface SignalPoint {
  /** Calendar month in `YYYY-MM` form. */
  period: string;
  /** Non-negative activity count for that period. */
  value: number;
}

/** Raw, pre-scoring signals attached to a node. */
export interface NodeSignals {
  /** Monthly activity series, oldest first. */
  activity: SignalPoint[];
  /** ISO date (`YYYY-MM-DD`) of the most recent observed signal. */
  lastActiveAt: string;
  /** Count of distinct public working implementations. */
  implementations: number;
  /** Years since the entity first appeared in the field. */
  maturityYears: number;
}

/** A vertex in the atlas graph. */
export interface AtlasNode {
  id: string;
  label: string;
  kind: NodeKind;
  summary: string;
  tags: string[];
  signals: NodeSignals;
}

/** A directed, weighted relationship between two nodes. */
export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  /** Relationship strength in the closed interval [0, 1]. */
  weight: number;
}

/** The five normalised sub-scores, each in [0, 1]. */
export interface ScoreBreakdown {
  momentum: number;
  recency: number;
  connectivity: number;
  novelty: number;
  feasibility: number;
}

/** A node's composite adjacency score and its components. */
export interface NodeScore {
  nodeId: string;
  /** Composite adjacency in the closed interval [0, 100]. */
  adjacency: number;
  breakdown: ScoreBreakdown;
}

/** Metadata describing how and when a snapshot was produced. */
export interface SnapshotMeta {
  id: string;
  generatedAt: string;
  domain: string;
  sourceWindow: {
    from: string;
    to: string;
  };
  nodeCount: number;
  edgeCount: number;
  engineVersion: string;
}

/** A scored, serialisable view of the atlas at a point in time. */
export interface AtlasSnapshot {
  meta: SnapshotMeta;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  scores: NodeScore[];
}

/** A short synthesised write-up for a single node. */
export interface Brief {
  id: string;
  nodeId: string;
  title: string;
  thesis: string;
  signals: string[];
  adjacency: number;
  generatedAt: string;
}
