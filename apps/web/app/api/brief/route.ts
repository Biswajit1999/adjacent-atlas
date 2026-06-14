import { NextResponse } from "next/server";
import { getBriefForNode, getBriefs } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

/**
 * Returns all briefs, or a single brief when `?node=<id>` is supplied.
 * Responds 404 when the requested node has no brief.
 */
export function GET(request: Request): NextResponse {
  const nodeId = new URL(request.url).searchParams.get("node");

  if (nodeId) {
    const brief = getBriefForNode(nodeId);
    if (!brief) {
      return NextResponse.json({ error: `No brief for node: ${nodeId}` }, { status: 404 });
    }
    return NextResponse.json(brief);
  }

  return NextResponse.json(getBriefs());
}
