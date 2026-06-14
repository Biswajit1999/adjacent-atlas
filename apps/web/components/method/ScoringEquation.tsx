import { DEFAULT_WEIGHTS } from "@adjacent-atlas/engine";
import { SUBSCORE_META, formatPercent } from "@/lib/format";

export function ScoringEquation(): JSX.Element {
  return (
    <div className="equation">
      <div className="equation__line">
        <span className="equation__lhs">adjacency</span>
        <span className="equation__eq">=</span>
        <span className="equation__rhs">
          100 × Σ <em>wᵢ</em> · <em>sᵢ</em>
        </span>
      </div>
      <div className="equation__terms">
        {SUBSCORE_META.map((meta) => (
          <div className="equation__term" key={meta.key}>
            <span className="equation__weight">{formatPercent(DEFAULT_WEIGHTS[meta.key])}</span>
            <span className="equation__name">{meta.label}</span>
            <span className="equation__blurb">{meta.blurb}</span>
          </div>
        ))}
      </div>
      <p className="equation__note">
        Each <span className="mono">sᵢ</span> is a component score in 0–1; the weights{" "}
        <span className="mono">wᵢ</span> are normalised to sum to 1. The values above are read
        directly from the engine.
      </p>
    </div>
  );
}
