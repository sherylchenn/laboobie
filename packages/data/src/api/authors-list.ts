import fs from "node:fs"
import path from "node:path"
import YAML from "yaml"
import slugify from "slugify"
import type { Author } from "../authors"

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : "."
)
const AUTHORS_DIR = path.resolve(WORKSPACE_ROOT, "authors")
const PROJECTS_DIR = path.resolve(WORKSPACE_ROOT, "projects")

export type AuthorWithProjectCount = Author & {
  projectCount: number
}

function isYamlFile(filename: string): boolean {
  return filename.endsWith(".yml") || filename.endsWith(".yaml")
}

function parseAuthorFile(filePath: string): Author | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const data = YAML.parse(fileContent)
    const slug = path.basename(filePath, path.extname(filePath))
    
    return {
      ...data,
      slug,
    }
  } catch (error) {
    console.error(`Error parsing author file ${filePath}:`, error)
    return null
  }
}

function getProjectCountForAuthor(authorSlug: string): number {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return 0
  }

  let count = 0
  
  function readProjectsRecursively(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        readProjectsRecursively(fullPath)
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          // Extract frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
          if (frontmatterMatch) {
            const frontmatter = YAML.parse(frontmatterMatch[1])
            const authorIds = frontmatter.authorIds || []
            if (authorIds.includes(authorSlug)) {
              count++
            }
          }
        } catch (error) {
          // Silently ignore errors for individual files
        }
      }
    }
  }

  readProjectsRecursively(PROJECTS_DIR)
  return count
}

export function getAuthorsWithProjectCount(): AuthorWithProjectCount[] {
  if (!fs.existsSync(AUTHORS_DIR)) {
    console.warn(`Authors directory not found: ${AUTHORS_DIR}`)
    return []
  }

  const files = fs.readdirSync(AUTHORS_DIR)
  const authors: AuthorWithProjectCount[] = []

  for (const file of files) {
    if (!isYamlFile(file)) continue
    
    const filePath = path.join(AUTHORS_DIR, file)
    const author = parseAuthorFile(filePath)
    
    if (author) {
      const projectCount = getProjectCountForAuthor(author.slug)
      authors.push({
        ...author,
        projectCount,
      })
    }
  }

  return authors
}

export function getTopAuthors(limit: number = 10): AuthorWithProjectCount[] {
  const authors = getAuthorsWithProjectCount()
  return authors
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, limit)
}

export function getAuthorBySlug(slug: string): AuthorWithProjectCount | null {
  const filePath = path.join(AUTHORS_DIR, `${slug}.yml`)
  
  if (!fs.existsSync(filePath)) {
    // Try with .yaml extension
    const yamlPath = path.join(AUTHORS_DIR, `${slug}.yaml`)
    if (!fs.existsSync(yamlPath)) {
      return null
    }
    
    const author = parseAuthorFile(yamlPath)
    if (!author) return null
    const projectCount = getProjectCountForAuthor(author.slug)
    return { ...author, projectCount }
  }
  
  const author = parseAuthorFile(filePath)
  if (!author) return null
  const projectCount = getProjectCountForAuthor(author.slug)
  return { ...author, projectCount }
}

export function sortAuthorsByName(authors: AuthorWithProjectCount[]): AuthorWithProjectCount[] {
  return [...authors].sort((a, b) => a.name.localeCompare(b.name))
}

export function sortAuthorsByProjectCount(authors: AuthorWithProjectCount[]): AuthorWithProjectCount[] {
  return [...authors].sort((a, b) => b.projectCount - a.projectCount)
}

export type AuthorSection = {
  tag: string
  authors: AuthorWithProjectCount[]
}

export function getAuthorSectionsByInitial(): AuthorSection[] {
  const authors = getAuthorsWithProjectCount()
  const sections: AuthorSection[] = []
  
  // First, separate ElevenLabs employees
  const elevenLabsAuthors = authors.filter(a => a.isElevenLabs)
  const communityAuthors = authors.filter(a => !a.isElevenLabs)
  
  // Add ElevenLabs section if there are any
  if (elevenLabsAuthors.length > 0) {
    sections.push({
      tag: "ElevenLabs",
      authors: sortAuthorsByName(elevenLabsAuthors)
    })
  }
  
  // Group community authors by first letter of their name
  const authorsByLetter = new Map<string, AuthorWithProjectCount[]>()
  
  for (const author of communityAuthors) {
    const firstLetter = author.name[0].toUpperCase()
    if (!authorsByLetter.has(firstLetter)) {
      authorsByLetter.set(firstLetter, [])
    }
    authorsByLetter.get(firstLetter)!.push(author)
  }
  
  // Sort letters alphabetically and create sections
  const sortedLetters = Array.from(authorsByLetter.keys()).sort()
  
  for (const letter of sortedLetters) {
    const authorsInSection = authorsByLetter.get(letter)!
    sections.push({
      tag: letter,
      authors: sortAuthorsByName(authorsInSection)
    })
  }
  
  return sections
}