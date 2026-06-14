/// <reference lib="webworker" />
import { computeLayout } from "@adjacent-atlas/engine";
import type { LayoutRequest, LayoutWorkerOutput } from "../lib/layout";

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.addEventListener("message", (event: MessageEvent<LayoutRequest>) => {
  const request = event.data;
  if (!request || request.type !== "layout:request") return;

  try {
    const total = request.options?.iterations ?? 240;

    const positions = computeLayout(
      request.nodes,
      request.edges,
      request.options,
      (snapshot, iteration) => {
        // Throttle progress so the main thread is not flooded with messages.
        if (iteration % 16 === 0) {
          const progress: LayoutWorkerOutput = {
            type: "layout:progress",
            iteration,
            total,
            positions: snapshot,
          };
          ctx.postMessage(progress);
        }
      },
    );

    const result: LayoutWorkerOutput = { type: "layout:result", positions };
    ctx.postMessage(result);
  } catch (err) {
    const error: LayoutWorkerOutput = {
      type: "layout:error",
      message: err instanceof Error ? err.message : String(err),
    };
    ctx.postMessage(error);
  }
});
