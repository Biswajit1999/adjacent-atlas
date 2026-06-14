import type { NodeKind } from "@adjacent-atlas/engine";
import { KIND_VISUALS } from "@/lib/format";

const KIND_ORDER: NodeKind[] = ["concept", "method", "instrument", "dataset", "repo", "paper"];

export interface AtlasLegendProps {
  kinds?: NodeKind[];
}

export function AtlasLegend({ kinds }: AtlasLegendProps): JSX.Element {
  const present = kinds && kinds.length > 0 ? KIND_ORDER.filter((k) => kinds.includes(k)) : KIND_ORDER;

  return (
    <div className="legend">
      <h3 className="legend__title">Legend</h3>
      <ul className="legend__list">
        {present.map((kind) => {
          const visual = KIND_VISUALS[kind];
          return (
            <li className="legend__item" key={kind}>
              <span className="legend__swatch" style={{ background: visual.color }} aria-hidden="true" />
              <span className="legend__label">{visual.label}</span>
              <span className="legend__desc">{visual.description}</span>
            </li>
          );
        })}
      </ul>
      <dl className="legend__encoding">
        <div>
          <dt>Size</dt>
          <dd>adjacency score</dd>
        </div>
        <div>
          <dt>Line</dt>
          <dd>relationship weight</dd>
        </div>
        <div>
          <dt>Centre</dt>
          <dd>higher adjacency</dd>
        </div>
      </dl>
    </div>
  );
}
