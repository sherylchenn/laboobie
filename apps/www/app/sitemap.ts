import { MetadataRoute } from "next"
import { getAllAuthors } from "@showcase/data/authors"
import { categories } from "@showcase/data/categories"
import type { CategoryId } from "@showcase/data/categories"

import { getProjects } from "@/lib/projects"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://showcase.elevenlabs.io"

  // Get all dynamic content
  const projects = await getProjects()
  const authors = await getAllAuthors()

  // Helper function to get the most recent project date for a category
  function getLastModifiedForCategory(categoryId: CategoryId): Date {
    const categoryProjects = projects.filter(
      (p) => p.categories && p.categories.includes(categoryId)
    )

    if (categoryProjects.length === 0) {
      return new Date()
    }

    return categoryProjects.reduce((latest, project) => {
      const projectDate = project.date ? new Date(project.date) : new Date()
      return projectDate > latest ? projectDate : latest
    }, new Date(0))
  }

  // Get the most recent project date for homepage and main projects page
  const mostRecentProjectDate = projects.reduce((latest, project) => {
    const projectDate = project.date ? new Date(project.date) : new Date()
    return projectDate > latest ? projectDate : latest
  }, new Date(0))

  const urls: MetadataRoute.Sitemap = [
    // Core pages
    {
      url: baseUrl,
      lastModified: mostRecentProjectDate,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: mostRecentProjectDate,
    },
    {
      url: `${baseUrl}/members`,
      lastModified: new Date(),
    },

    // Showcase category pages
    {
      url: `${baseUrl}/showcase/agents`,
      lastModified: getLastModifiedForCategory("agents"),
    },
    {
      url: `${baseUrl}/showcase/text-to-speech`,
      lastModified: getLastModifiedForCategory("text-to-speech"),
    },
    {
      url: `${baseUrl}/showcase/voices`,
      lastModified: getLastModifiedForCategory("voices"),
    },
    {
      url: `${baseUrl}/showcase/speech-to-text`,
      lastModified: getLastModifiedForCategory("speech-to-text"),
    },
    {
      url: `${baseUrl}/showcase/music`,
      lastModified: getLastModifiedForCategory("music"),
    },
    {
      url: `${baseUrl}/showcase/sound-effects`,
      lastModified: getLastModifiedForCategory("sound-effects"),
    },

    // All project detail pages
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/p/${project.slug}`,
      lastModified: project.date ? new Date(project.date) : new Date(),
    })),

    // Category pages
    ...categories.map((category) => ({
      url: `${baseUrl}/projects/category/${category.id}`,
      lastModified: getLastModifiedForCategory(category.id),
    })),

    // Member pages
    ...authors.map((author) => ({
      url: `${baseUrl}/members/${author.slug}`,
      lastModified: new Date(),
    })),
  ]

  return urls
}
