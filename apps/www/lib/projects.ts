import { source } from "@/lib/source"
import { getAuthorById } from "@showcase/data/authors"
import type { Author } from "@showcase/data/authors"
import type { CategoryId } from "@showcase/data/categories"

export interface Project {
  title: string
  description?: string
  categories: CategoryId[]
  slug: string
  authorIds: string[]
  date?: string
  isFeatured?: boolean
  image?: string
  demoUrl?: string
  repoUrl?: string
  videoUrl?: string
  xUrl?: string
  authors: Author[]
  url: string
}

export async function getProjects(): Promise<Project[]> {
  const pages = source.getPages()
  
  const projects: Project[] = await Promise.all(
    pages.map(async (page) => {
      const authorIds = page.data.authorIds || []
      const authors = await Promise.all(
        authorIds.map(async (id) => {
          const author = await getAuthorById(id)
          return author
        })
      )
      
      return {
        title: page.data.title,
        description: page.data.description,
        categories: (page.data.categories || []) as CategoryId[],
        slug: page.slugs.join("/"),
        authorIds,
        date: page.data.date,
        isFeatured: page.data.isFeatured,
        image: page.data.image,
        demoUrl: page.data.demoUrl,
        repoUrl: page.data.repoUrl,
        videoUrl: page.data.videoUrl,
        xUrl: page.data.xUrl,
        authors: authors.filter(Boolean) as Author[],
        url: page.url,
      }
    })
  )
  
  return projects.filter(p => p.title && p.description)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(p => p.isFeatured)
}

export async function getProjectsByCategory(categoryId: CategoryId): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(p => p.categories.includes(categoryId))
}

export async function getProjectsByAuthor(authorId: string): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(p => p.authorIds.includes(authorId))
}