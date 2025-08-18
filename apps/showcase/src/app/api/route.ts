import { samples } from "@showcase/data/samples";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ data: samples });
}
