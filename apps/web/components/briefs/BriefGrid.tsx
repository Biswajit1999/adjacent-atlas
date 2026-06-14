import type { Brief } from "@adjacent-atlas/engine";
import { BriefCard } from "./BriefCard";
import { EmptyState } from "@/components/shared/EmptyState";

export interface BriefGridProps {
  briefs: Brief[];
}

export function BriefGrid({ briefs }: BriefGridProps): JSX.Element {
  if (briefs.length === 0) {
    return <EmptyState title="No briefs yet" message="Build a snapshot to generate briefs." />;
  }
  return (
    <div className="brief-grid">
      {briefs.map((brief) => (
        <BriefCard key={brief.id} brief={brief} />
      ))}
    </div>
  );
}
