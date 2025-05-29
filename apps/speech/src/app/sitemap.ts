import { getSections } from "@directories/data/samples";
import type { MetadataRoute } from "next";

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
      url: `${BASE_URL}/samples`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/samples/popular`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Add routes for each samples section
  for (const section of sections) {
    for (const sample of section.samples) {
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
      url: `${BASE_URL}/samples/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
