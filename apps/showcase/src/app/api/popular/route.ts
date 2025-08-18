import { getPopularSamples } from "@directories/data/popular";
import { NextResponse } from "next/server";

export const revalidate = 86400; // Revalidate once every day
export const dynamic = "force-static";

const popularSamples = await getPopularSamples();

export async function GET() {
  const allSamples = popularSamples.flatMap((section) => section.samples);

  // Create a Set to track unique slugs and an array for unique samples
  const uniqueSlugs = new Set();
  const uniqueSamples = [];

  for (const sample of allSamples) {
    if (uniqueSlugs.has(sample.slug)) continue; // Skip if slug is already in the Set
    uniqueSlugs.add(sample.slug); // Add slug to the Set
    uniqueSamples.push(sample); // Keep the sample
  }

  const sortedSamples = uniqueSamples.sort((a, b) => b.count - a.count);

  return new NextResponse(JSON.stringify({ data: sortedSamples }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
      "Vercel-CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
