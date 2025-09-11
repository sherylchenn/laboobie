import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://showcase.elevenlabs.io/sitemap.xml",
    host: "https://showcase.elevenlabs.io",
  }
}
