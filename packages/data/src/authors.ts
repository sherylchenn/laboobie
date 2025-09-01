import fs from "node:fs"
import path from "node:path"
import slugify from "slugify"
import YAML from "yaml"

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : "."
)
const AUTHORS_DIR = path.resolve(WORKSPACE_ROOT, "authors")

export type Author = {
  name: string
  slug: string
  avatar?: string
  url?: string
  bio?: string
  location?: string
  isElevenLabs?: boolean

  socials?: Array<{
    platform: "GitHub" | "X" | "LinkedIn" | "Website"
    url: string
  }>
}

function isYamlFile(filename: string): boolean {
  return filename.endsWith(".yml") || filename.endsWith(".yaml")
}

export function getAllAuthors(): Author[] {
  if (!fs.existsSync(AUTHORS_DIR)) {
    return []
  }

  const files = fs.readdirSync(AUTHORS_DIR)
  const authors: Author[] = []

  for (const file of files) {
    if (!isYamlFile(file)) continue

    const filePath = path.join(AUTHORS_DIR, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const data = YAML.parse(content)
    
    const slug = file.replace(/\.(yml|yaml)$/, "")
    
    authors.push({
      ...data,
      slug,
    })
  }

  return authors
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const authorFile = path.join(AUTHORS_DIR, `${id}.yml`)
  
  if (!fs.existsSync(authorFile)) {
    const authorFileAlt = path.join(AUTHORS_DIR, `${id}.yaml`)
    if (!fs.existsSync(authorFileAlt)) {
      return null
    }
    const content = fs.readFileSync(authorFileAlt, "utf-8")
    const data = YAML.parse(content)
    return {
      ...data,
      slug: id,
    }
  }
  
  const content = fs.readFileSync(authorFile, "utf-8")
  const data = YAML.parse(content)
  return {
    ...data,
    slug: id,
  }
}

export function getAuthorBySlug(slug: string): Author | null {
  const authors = getAllAuthors()
  return authors.find(author => author.slug === slug) || null
}
