"use client";

import { useEffect, useState } from "react";
import type { AtlasSnapshot } from "@adjacent-atlas/engine";

export type SnapshotStatus = "idle" | "loading" | "ready" | "error";

export interface UseSnapshotResult {
  snapshot: AtlasSnapshot | null;
  status: SnapshotStatus;
  error: string | null;
  /** True while a refetch is in flight but stale data is still being shown. */
  stale: boolean;
  reload: () => void;
}

/**
 * Fetches the snapshot from /api/snapshot. If an initial snapshot is provided
 * (e.g. from the server render), it is shown immediately and refreshed in the
 * background, so the UI never flashes empty.
 */
export function useSnapshot(initial?: AtlasSnapshot | null): UseSnapshotResult {
  const [snapshot, setSnapshot] = useState<AtlasSnapshot | null>(initial ?? null);
  const [status, setStatus] = useState<SnapshotStatus>(initial ? "ready" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState<boolean>(Boolean(initial));
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setStatus((prev) => (snapshot ? prev : "loading"));
    if (snapshot) setStale(true);

    fetch("/api/snapshot", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Snapshot request failed (${res.status})`);
        return (await res.json()) as AtlasSnapshot;
      })
      .then((data) => {
        if (cancelled) return;
        setSnapshot(data);
        setStatus("ready");
        setStale(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus(snapshot ? "ready" : "error");
        setStale(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // Refetch only when explicitly reloaded; `snapshot` is intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  return { snapshot, status, error, stale, reload: () => setNonce((n) => n + 1) };
}
