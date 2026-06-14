import type { Brief } from "@adjacent-atlas/engine";

export interface BriefCardProps {
  brief: Brief;
}

export function BriefCard({ brief }: BriefCardProps): JSX.Element {
  return (
    <article className="brief">
      <div className="brief__head">
        <h3 className="brief__title">
          <a href={`/atlas#${brief.nodeId}`}>{brief.title}</a>
        </h3>
        <span className="brief__adjacency">{brief.adjacency.toFixed(1)}</span>
      </div>
      <p className="brief__thesis">{brief.thesis}</p>
      <ul className="signal-list">
        {brief.signals.map((signal) => (
          <li className="signal" key={signal}>
            {signal}
          </li>
        ))}
      </ul>
    </article>
  );
}
