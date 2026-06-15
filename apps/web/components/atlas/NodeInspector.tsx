import { ScoreBar, Tag } from "@adjacent-atlas/ui";
import { opportunityScore } from "@adjacent-atlas/engine";
import type { AtlasNode, NodeScore } from "@adjacent-atlas/engine";
import { KIND_VISUALS, SUBSCORE_META, formatDate, formatMonth } from "@/lib/format";

export interface NodeInspectorProps {
  node: AtlasNode;
  score: NodeScore;
  onClose: () => void;
}

function Sparkline({ values }: { values: number[] }): JSX.Element | null {
  if (values.length < 2) return null;
  const width = 132;
  const height = 30;
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * (height - 2) - 1).toFixed(1)}`)
    .join(" ");
  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Activity over recent months">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function NodeInspector({ node, score, onClose }: NodeInspectorProps): JSX.Element {
  const visual = KIND_VISUALS[node.kind];
  const activity = node.signals.activity;
  const firstPeriod = activity.at(0)?.period;
  const lastPeriod = activity.at(-1)?.period;

  return (
    <div className="inspector">
      <div className="inspector__head">
        <div className="inspector__title-wrap">
          <span className="inspector__dot" style={{ background: visual.color }} aria-hidden="true" />
          <h3 className="inspector__title">{node.label}</h3>
        </div>
        <button type="button" className="inspector__close" onClick={onClose} aria-label="Close inspector">
          ×
        </button>
      </div>

      <div className="inspector__tags">
        <Tag label={visual.label} tone="accent" />
        {node.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <p className="inspector__summary">{node.summary}</p>

      <div className="inspector__adjacency">
        <ScoreBar value={score.adjacency} label="adjacency" />
      </div>

      <div className="inspector__breakdown">
        {SUBSCORE_META.map((meta) => (
          <ScoreBar key={meta.key} value={score.breakdown[meta.key] * 100} label={meta.label} />
        ))}
      </div>

      <div className="inspector__opportunity">
        <ScoreBar value={opportunityScore(score.breakdown) * 100} label="opportunity" />
      </div>

      <dl className="inspector__facts">
        <div>
          <dt>Last active</dt>
          <dd>{formatDate(node.signals.lastActiveAt)}</dd>
        </div>
        <div>
          <dt>Implementations</dt>
          <dd>{node.signals.implementations}</dd>
        </div>
        <div>
          <dt>Maturity</dt>
          <dd>{node.signals.maturityYears} yr</dd>
        </div>
      </dl>

      {activity.length >= 2 ? (
        <div className="inspector__activity">
          <div className="inspector__activity-head">
            <span>Activity</span>
            {firstPeriod && lastPeriod ? (
              <span className="mono">
                {formatMonth(firstPeriod)} – {formatMonth(lastPeriod)}
              </span>
            ) : null}
          </div>
          <Sparkline values={activity.map((p) => p.value)} />
        </div>
      ) : null}
    </div>
  );
}
