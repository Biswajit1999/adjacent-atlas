import {
  computeLayout,
  type AtlasEdge,
  type AtlasNode,
  type LayoutOptions,
  type LayoutPosition,
} from "@adjacent-atlas/engine";

export type { LayoutPosition };

/** Request sent to the layout worker (also used by the synchronous fallback). */
export interface LayoutRequest {
  type: "layout:request";
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  options?: LayoutOptions;
}

export interface LayoutProgress {
  type: "layout:progress";
  iteration: number;
  total: number;
  positions: LayoutPosition[];
}

export interface LayoutResult {
  type: "layout:result";
  positions: LayoutPosition[];
}

export interface LayoutError {
  type: "layout:error";
  message: string;
}

export type LayoutWorkerOutput = LayoutProgress | LayoutResult | LayoutError;

/** Run the layout on the calling thread. Used when Web Workers are unavailable. */
export function runLayoutSync(request: LayoutRequest): LayoutPosition[] {
  return computeLayout(request.nodes, request.edges, request.options);
}
