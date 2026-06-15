import { formatMonth } from "@/lib/format";
import type { TimelinePoint } from "@/lib/graph-metrics";

export interface AtlasTimelineProps {
  points: TimelinePoint[];
}

/**
 * Aggregate activity across the graph over time. Coarse by design — it reflects
 * the activity periods present in the data (monthly for code-derived signals,
 * yearly for literature-derived signals).
 */
export function AtlasTimeline({ points }: AtlasTimelineProps): JSX.Element | null {
  if (points.length < 2) return null;

  const width = 640;
  const height = 96;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...points.map((p) => p.value), 1);
  const step = (width - padX * 2) / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = padX + i * step;
    const y = height - padY - (p.value / max) * (height - padY * 2);
    return { x, y };
  });

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${height - padY} L${coords[0].x.toFixed(1)},${height - padY} Z`;

  const peak = points.reduce((a, b) => (b.value > a.value ? b : a), points[0]);

  return (
    <div className="panel-block timeline">
      <div className="timeline__head">
        <h3 className="panel-block__title" style={{ margin: 0 }}>Activity timeline</h3>
        <span className="muted">peak {peak.value} in {formatMonth(peak.period)}</span>
      </div>
      <svg className="timeline__svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Aggregate activity over time">
        <path d={area} className="timeline__area" />
        <path d={line} className="timeline__line" />
      </svg>
      <div className="timeline__axis">
        <span className="mono">{formatMonth(points[0].period)}</span>
        <span className="mono">{formatMonth(points[points.length - 1].period)}</span>
      </div>
    </div>
  );
}
