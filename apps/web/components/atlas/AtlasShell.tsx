"use client";

import { useEffect, useMemo, useState } from "react";
import type { AtlasSnapshot, NodeScore } from "@adjacent-atlas/engine";
import { AtlasScene } from "./AtlasScene";
import { AtlasLegend } from "./AtlasLegend";
import { AtlasFilters } from "./AtlasFilters";
import { NodeInspector } from "./NodeInspector";
import { RankedNodeList } from "./RankedNodeList";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useSnapshot } from "@/hooks/useSnapshot";
import {
  runLayoutSync,
  type LayoutPosition,
  type LayoutRequest,
  type LayoutWorkerOutput,
} from "@/lib/layout";
import {
  applyFilter,
  collectKinds,
  collectTags,
  isFilterActive,
  rankEntries,
  visibleIdSet,
  DEFAULT_FILTER,
  type FilterState,
} from "@/lib/filter";

export interface AtlasShellProps {
  initialSnapshot: AtlasSnapshot;
}

export function AtlasShell({ initialSnapshot }: AtlasShellProps): JSX.Element {
  const { snapshot, status, error, stale, reload } = useSnapshot(initialSnapshot);
  const data = snapshot ?? initialSnapshot;

  const entries = useMemo(() => rankEntries(data), [data]);
  const kinds = useMemo(() => collectKinds(data.nodes), [data]);
  const tags = useMemo(() => collectTags(data.nodes), [data]);
  const scoreById = useMemo(() => {
    const record: Record<string, NodeScore> = {};
    for (const score of data.scores) record[score.nodeId] = score;
    return record;
  }, [data]);

  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [positions, setPositions] = useState<LayoutPosition[] | null>(null);

  const filtered = useMemo(() => applyFilter(entries, filter), [entries, filter]);
  const active = isFilterActive(filter);
  const visibleIds = useMemo(
    () => (active ? visibleIdSet(entries, filter) : null),
    [active, entries, filter],
  );

  // Layout: prefer a worker; fall back to a synchronous pass when workers are
  // unavailable or fail. The graph is small at seed scale, so the fallback is cheap.
  useEffect(() => {
    let cancelled = false;
    setPositions(null);

    const scores: Record<string, number> = {};
    for (const score of data.scores) scores[score.nodeId] = score.adjacency;
    const request: LayoutRequest = {
      type: "layout:request",
      nodes: data.nodes,
      edges: data.edges,
      options: { iterations: 280, dimensions: 3, scores },
    };

    let worker: Worker | null = null;
    try {
      if (typeof window !== "undefined" && typeof Worker !== "undefined") {
        worker = new Worker(new URL("../../workers/layout.worker.ts", import.meta.url), {
          type: "module",
        });
        worker.onmessage = (event: MessageEvent<LayoutWorkerOutput>) => {
          if (cancelled) return;
          const message = event.data;
          if (message.type === "layout:progress" || message.type === "layout:result") {
            setPositions(message.positions);
          } else if (message.type === "layout:error") {
            setPositions(runLayoutSync(request));
          }
        };
        worker.onerror = () => {
          if (!cancelled) setPositions(runLayoutSync(request));
        };
        worker.postMessage(request);
      } else {
        setPositions(runLayoutSync(request));
      }
    } catch {
      if (!cancelled) setPositions(runLayoutSync(request));
    }

    return () => {
      cancelled = true;
      worker?.terminate();
    };
  }, [data]);

  const selectedEntry = selectedId
    ? entries.find((entry) => entry.node.id === selectedId) ?? null
    : null;
  const hoveredLabel = hoveredId
    ? data.nodes.find((node) => node.id === hoveredId)?.label ?? null
    : null;

  if (status === "error" && !snapshot) {
    return <ErrorState message={error ?? "Could not load the snapshot."} onRetry={reload} />;
  }

  return (
    <div className="atlas">
      <div className="atlas__scene-wrap">
        <AtlasScene
          nodes={data.nodes}
          edges={data.edges}
          scoreById={scoreById}
          positions={positions}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          visibleIds={visibleIds}
          height={560}
        />
        <div className="atlas__overlay-top">
          <span className="mono atlas__snapshot-id">{data.meta.id}</span>
          {stale ? <span className="atlas__badge">refreshing…</span> : null}
          {hoveredLabel ? <span className="atlas__hover">{hoveredLabel}</span> : null}
        </div>
        {selectedEntry ? (
          <div className="atlas__inspector">
            <NodeInspector
              node={selectedEntry.node}
              score={selectedEntry.score}
              onClose={() => setSelectedId(null)}
            />
          </div>
        ) : null}
      </div>

      <aside className="atlas__side">
        <AtlasFilters kinds={kinds} tags={tags} filter={filter} onChange={setFilter} />
        <AtlasLegend kinds={kinds} />
      </aside>

      <div className="atlas__list">
        <div className="atlas__list-head">
          <h2 className="atlas__list-title">Ranked nodes</h2>
          <span className="muted">
            {filtered.length} of {entries.length}
          </span>
        </div>
        {status === "loading" && !snapshot ? (
          <LoadingState message="Loading snapshot…" />
        ) : (
          <RankedNodeList entries={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>
    </div>
  );
}
