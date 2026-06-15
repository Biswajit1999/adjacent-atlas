import { OPPORTUNITY_WEIGHTS } from "@adjacent-atlas/engine";
import { kindVisual } from "@/lib/format";
import type { OpportunityRow } from "@/lib/graph-metrics";

export interface OpportunityRadarProps {
  rows: OpportunityRow[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const COMPONENTS: { key: "momentum" | "novelty" | "feasibility"; short: string }[] = [
  { key: "momentum", short: "M" },
  { key: "novelty", short: "N" },
  { key: "feasibility", short: "F" },
];

/**
 * Ranks nodes by the forward-looking lens (momentum/novelty/feasibility),
 * which surfaces "reachable next" candidates that raw adjacency can bury.
 */
export function OpportunityRadar({ rows, selectedId, onSelect }: OpportunityRadarProps): JSX.Element {
  return (
    <div className="panel-block">
      <h3 className="panel-block__title">Opportunity radar</h3>
      <p className="panel-block__hint">
        Weighted toward momentum ({Math.round(OPPORTUNITY_WEIGHTS.momentum * 100)}%), novelty (
        {Math.round(OPPORTUNITY_WEIGHTS.novelty * 100)}%), feasibility (
        {Math.round(OPPORTUNITY_WEIGHTS.feasibility * 100)}%).
      </p>
      <ul className="radar">
        {rows.map((row) => {
          const active = selectedId === row.nodeId;
          const interactive = Boolean(onSelect);
          return (
            <li key={row.nodeId}>
              <button
                type="button"
                className={`radar__row${active ? " is-active" : ""}`}
                onClick={onSelect ? () => onSelect(row.nodeId) : undefined}
                disabled={!interactive}
              >
                <span className="radar__label">
                  <span className="radar__dot" style={{ background: kindVisual(row.kind).color }} aria-hidden="true" />
                  {row.label}
                </span>
                <span className="radar__bars" aria-hidden="true">
                  {COMPONENTS.map((c) => (
                    <span key={c.key} className="minibar" title={`${c.key} ${row[c.key].toFixed(2)}`}>
                      <span className="minibar__fill" style={{ height: `${row[c.key] * 100}%` }} />
                    </span>
                  ))}
                </span>
                <span className="radar__score mono">{Math.round(row.opportunity * 100)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
