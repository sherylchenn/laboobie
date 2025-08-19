import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import slugify from "slugify";
import { getAllProfiles } from "../profiles";

// Resolve workspace root
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT
  ? path.resolve(process.env.WORKSPACE_ROOT)
  : path.resolve(
      process.cwd(),
      process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : ".",
    );

// Projects directory is now at the root
const PROJECTS_DIR = process.env.PROJECTS_DIR
  ? path.resolve(process.env.PROJECTS_DIR)
  : path.resolve(WORKSPACE_ROOT, "projects");

export type ProjectAuthor = {
  name: string;
  url?: string;
  avatar?: string;
};

export interface Project {
  // Core fields
  title: string;
  description?: string;
  category: string; // Now from frontmatter
  slug: string;

  // Content
  markdown: string; // The actual markdown content

  // Metadata
  date?: string;
  isFeatured?: boolean;
  image?: string;
  galleryImages?: string[];

  // Links
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  xUrl?: string;

  // Authors and tech
  authors: ProjectAuthor[];
  technologies?: string[];
  apis?: string[];
  tags?: string[];

  // Alias property for clarity with new frontmatter
  authorIds?: string[];
}

export type Section = {
  tag: string; // category label
  slug: string; // slugified category
  projects: Project[];
};

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith(".md") || filename.endsWith(".mdx");
}

// Strongly type the frontmatter to avoid `any`
interface ParsedFrontmatter {
  title?: unknown;
  category?: unknown;
  description?: unknown;
  date?: unknown;
  isFeatured?: unknown;
  image?: unknown;
  galleryImages?: unknown;
  demoUrl?: unknown;
  repoUrl?: unknown;
  videoUrl?: unknown;
  xUrl?: unknown;
  technologies?: unknown;
  apis?: unknown;
  tags?: unknown;
  authorIds?: unknown;
}

function toStringIf(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function toStringArrayIf(val: unknown): string[] | undefined {
  return Array.isArray(val) ? (val.map(String) as string[]) : undefined;
}

function parseProject(filePath: string): Project | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as ParsedFrontmatter;

    // Get filename without extension for slug
    const basename = path.basename(filePath, path.extname(filePath));

    const title = toStringIf(frontmatter.title);
    const category = toStringIf(frontmatter.category);
    if (!title || !category) {
      console.warn(`Missing required fields in ${filePath}`);
      return null;
    }

    // Generate slug from category and filename
    const slug = `${slugify(category, { lower: true })}/${slugify(basename, { lower: true })}`;

    // Resolve authors from user ids
    const preferredIds = toStringArrayIf(frontmatter.authorIds);

    let authors: ProjectAuthor[] = [];
    const authorIds: string[] | undefined = preferredIds;

    if (preferredIds && preferredIds.length > 0) {
      const allProfiles = getAllProfiles();
      authors = preferredIds
        .map((id) => allProfiles.find((p) => p.slug === id))
        .filter(Boolean)
        .map((u) => ({ name: u!.name, url: u!.url, avatar: u!.avatar }));
    }

    return {
      // Core fields
      title,
      description: toStringIf(frontmatter.description),
      category,
      slug,

      // Content
      markdown: content.trim(),

      // Metadata
      date: toStringIf(frontmatter.date),
      isFeatured: Boolean(frontmatter.isFeatured),
      image: toStringIf(frontmatter.image),
      galleryImages: toStringArrayIf(frontmatter.galleryImages),

      // Links
      demoUrl: toStringIf(frontmatter.demoUrl),
      repoUrl: toStringIf(frontmatter.repoUrl),
      videoUrl: toStringIf(frontmatter.videoUrl),
      xUrl: toStringIf(frontmatter.xUrl),

      // Authors and tech
      authors,
      technologies: toStringArrayIf(frontmatter.technologies),
      apis: toStringArrayIf(frontmatter.apis),
      tags: toStringArrayIf(frontmatter.tags),

      authorIds,
    };
  } catch (error) {
    console.error(`Failed to parse project file ${filePath}:`, error);
    return null;
  }
}

function loadAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.warn(`Projects directory not found: ${PROJECTS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(PROJECTS_DIR);
  const projects: Project[] = [];

  for (const file of files) {
    if (!isMarkdownFile(file)) continue;

    const filePath = path.join(PROJECTS_DIR, file);
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) continue;

    const project = parseProject(filePath);
    if (project) {
      projects.push(project);
    }
  }

  return projects;
}

// Cache projects
const cachedProjects: Project[] = loadAllProjects();

export function getSections(): Section[] {
  const byCategory = new Map<string, Project[]>();

  for (const project of cachedProjects) {
    const arr = byCategory.get(project.category) || [];
    arr.push(project);
    byCategory.set(project.category, arr);
  }

  const sections: Section[] = Array.from(byCategory.entries()).map(
    ([category, items]) => ({
      tag: category,
      slug: slugify(category, { lower: true }),
      projects: items.sort((a, b) =>
        (b.date || "").localeCompare(a.date || ""),
      ),
    }),
  );

  return sections.sort((a, b) => b.projects.length - a.projects.length);
}

export function getSectionBySlug(slug: string): Section | undefined {
  return getSections().find((section) => section.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return cachedProjects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return cachedProjects;
}
