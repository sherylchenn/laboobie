import { getSampleBySlug, samples } from "@directories/data/samples";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export async function generateStaticParams() {
  return samples.map((sample) => ({
    slug: sample.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  const sample = getSampleBySlug(slug);

  if (!sample) {
    return NextResponse.json({ error: "Sample not found" }, { status: 404 });
  }

  return new Response(JSON.stringify({ data: sample }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
      "Vercel-CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
