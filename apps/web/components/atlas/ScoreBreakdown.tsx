import { ScoreBar } from "@adjacent-atlas/ui";
import type { ScoreBreakdown as Breakdown } from "@adjacent-atlas/engine";
import { SUBSCORE_META } from "@/lib/format";

export interface ScoreBreakdownProps {
  breakdown: Breakdown;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps): JSX.Element {
  return (
    <div className="subscores">
      {SUBSCORE_META.map((meta) => (
        <ScoreBar key={meta.key} value={breakdown[meta.key] * 100} label={meta.label} />
      ))}
    </div>
  );
}
