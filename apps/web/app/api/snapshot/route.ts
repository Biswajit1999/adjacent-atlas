import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

/** Returns the current scored snapshot as JSON. */
export function GET(): NextResponse {
  return NextResponse.json(getSnapshot());
}
