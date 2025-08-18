import { getPopularProjects } from "@showcase/data/popular";
import { NextResponse } from "next/server";

export const revalidate = 86400; // Revalidate once every day
export const dynamic = "force-static";

const popularProjects = await getPopularProjects();

export async function GET() {
  const allProjects = popularProjects.flatMap((section) => section.projects);

  const uniqueSlugs = new Set<string>();
  const uniqueProjects: typeof allProjects = [];

  for (const project of allProjects) {
    if (uniqueSlugs.has(project.slug)) continue;
    uniqueSlugs.add(project.slug);
    uniqueProjects.push(project);
  }

  return new NextResponse(JSON.stringify({ data: uniqueProjects }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
      "Vercel-CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
