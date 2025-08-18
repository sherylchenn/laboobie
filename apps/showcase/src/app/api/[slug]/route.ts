import { getProjectBySlug } from "@showcase/data/projects";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  const project = getProjectBySlug(slug);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return new NextResponse(JSON.stringify({ data: project }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
      "Vercel-CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
