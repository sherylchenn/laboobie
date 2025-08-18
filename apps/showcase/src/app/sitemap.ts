import type { MetadataRoute } from "next";
import { getSections } from "../../../../packages/data/src/projects";

const BASE_URL = "https://speech.directory";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all speech sections
  const sections = getSections();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects/popular`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Add routes for each projects section
  for (const section of sections) {
    for (const sample of section.projects) {
      routes.push({
        url: `${BASE_URL}/${sample.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const section of sections) {
    routes.push({
      url: `${BASE_URL}/projects/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
