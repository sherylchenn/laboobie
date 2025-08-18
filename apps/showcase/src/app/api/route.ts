import { NextResponse } from "next/server";
import { projects } from "../../../../../packages/data/src/projects";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ data: projects });
}
