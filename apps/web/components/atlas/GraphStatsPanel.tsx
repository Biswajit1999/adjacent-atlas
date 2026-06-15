import { Tag } from "@adjacent-atlas/ui";
import type { AtlasStats } from "@/lib/graph-metrics";

export interface GraphStatsPanelProps {
  stats: AtlasStats;
}

export function GraphStatsPanel({ stats }: GraphStatsPanelProps): JSX.Element {
  const maxBin = Math.max(1, ...stats.histogram.map((b) => b.count));

  return (
    <div className="panel-block">
      <h3 className="panel-block__title">Graph statistics</h3>

      <dl className="stat-grid">
        <div>
          <dt>Nodes</dt>
          <dd className="mono">{stats.nodeCount}</dd>
        </div>
        <div>
          <dt>Edges</dt>
          <dd className="mono">{stats.edgeCount}</dd>
        </div>
        <div>
          <dt>Density</dt>
          <dd className="mono">{stats.density.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Mean adj.</dt>
          <dd className="mono">{stats.score.mean.toFixed(1)}</dd>
        </div>
      </dl>

      <div className="histogram" aria-hidden="true">
        {stats.histogram.map((bin) => (
          <div
            key={bin.from}
            className="histogram__bar"
            style={{ height: `${(bin.count / maxBin) * 100}%` }}
            title={`${bin.from}-${bin.to}: ${bin.count}`}
          />
        ))}
      </div>
      <div className="histogram__axis">
        <span>0</span>
        <span>adjacency</span>
        <span>100</span>
      </div>

      {stats.topTags.length > 0 ? (
        <div className="tagcloud">
          {stats.topTags.map((t) => (
            <Tag key={t.tag} label={`${t.tag} ${t.count}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
