import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBriefs, getRanked } from "@/lib/snapshot";
import { BriefDetail } from "@/components/briefs/BriefDetail";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams(): { id: string }[] {
  return getBriefs().map((brief) => ({ id: brief.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const brief = getBriefs().find((b) => b.id === params.id);
  if (!brief) return { title: "Brief not found" };
  return {
    title: brief.title,
    description: brief.thesis.slice(0, 155),
  };
}

export default function BriefPage({ params }: PageProps): JSX.Element {
  const brief = getBriefs().find((b) => b.id === params.id);
  if (!brief) notFound();

  const entry = getRanked().find((e) => e.node.id === brief.nodeId) ?? null;

  return (
    <section className="page container">
      <BriefDetail brief={brief} node={entry?.node ?? null} score={entry?.score ?? null} />
    </section>
  );
}
