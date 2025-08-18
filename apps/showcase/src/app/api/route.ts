import { getSections } from "@showcase/data/projects";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  const sections = getSections();
  const all = sections.flatMap((s) => s.projects);
  return NextResponse.json({ data: all });
}
