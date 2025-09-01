import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import slugify from "slugify"

import type { Author } from "./authors"
import {
  CategoryId,
  categories,
  getCategoryById,
  isValidCategoryId,
} from "./categories"

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : "."
)

const PROJECTS_DIR = path.resolve(WORKSPACE_ROOT, "projects")

export interface Project {
  title: string
  description?: string
  categories: CategoryId[]
  slug: string
  authorIds: string[]
  markdown: string
  date?: string
  isFeatured?: boolean
  image?: string
  demoUrl?: string
  repoUrl?: string
  videoUrl?: string
  xUrl?: string
  // Expanded fields
  authors: Author[]
}

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith(".md") || filename.endsWith(".mdx")
}
