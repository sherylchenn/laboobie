import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import YAML from "yaml";

// Resolve workspace root and projects dir robustly in monorepo/dev
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT
  ? path.resolve(process.env.WORKSPACE_ROOT)
  : path.resolve(
      process.cwd(),
      process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : ".",
    );

// Public assets root for Next.js app
const PUBLIC_DIR = path.resolve(WORKSPACE_ROOT, "apps/showcase/public");

// Allow overriding via env; default to monorepo path
const PROJECTS_BASE_DIR = process.env.PROJECTS_DIR
  ? path.resolve(process.env.PROJECTS_DIR)
  : path.resolve(WORKSPACE_ROOT, "packages/data/src/projects");

export type ProjectAuthor = {
  name: string;
  url?: string | null;
  avatar?: string | null;
};

export interface Project {
  title: string;
  shortDescription?: string;
  longDescription?: string;
  coverImage?: string;
  galleryImages?: string[];
  isFeatured?: boolean;
  date?: string; // ISO string (from YAML)
  platform?: string;
  externalTech?: string[];
  tags?: string[];
  authors?: ProjectAuthor[];
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  xUrl?: string;
  useCases?: string[];
  category: string; // derived from folder name
  slug: string; // category/filename (slugified)
}

export type Section = {
  tag: string; // category label (folder name)
  slug: string; // slugified tag
  projects: Project[];
};

function isYamlFile(filename: string) {
  return filename.endsWith(".yml") || filename.endsWith(".yaml");
}

function readYamlFile(filePath: string): Record<string, unknown> | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return YAML.parse(raw) as Record<string, unknown>;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to read YAML file at ${filePath}:`, e);
    return null;
  }
}

function isExistingPublicPath(publicPath: string): boolean {
  const rel = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  const abs = path.join(PUBLIC_DIR, rel);
  return fs.existsSync(abs);
}

function getPublicPathFromAbsolute(absolutePath: string): string | undefined {
  const normalizedPublic = PUBLIC_DIR.endsWith(path.sep)
    ? PUBLIC_DIR
    : `${PUBLIC_DIR}${path.sep}`;
  const normalizedAbs = absolutePath;
  if (!normalizedAbs.startsWith(normalizedPublic)) return undefined;
  const rel = normalizedAbs
    .slice(normalizedPublic.length)
    .split(path.sep)
    .join("/");
  return `/${rel}`;
}

function resolveCoverImageFallback(
  category: string,
  projectBaseName: string,
): string | undefined {
  const cat = slugify(category, { lower: true });
  const proj = slugify(projectBaseName, { lower: true });
  const exts = ["png", "jpg", "jpeg", "webp", "avif"];
  const candidates: string[] = [];
  for (const ext of exts) {
    candidates.push(
      path.join(PUBLIC_DIR, "images", "projects", cat, proj, `cover.${ext}`),
      path.join(PUBLIC_DIR, "projects", proj, `cover.${ext}`),
      path.join(PUBLIC_DIR, "projects", cat, proj, `cover.${ext}`),
    );
  }
  for (const abs of candidates) {
    if (fs.existsSync(abs)) {
      const pub = getPublicPathFromAbsolute(abs);
      if (pub) return pub;
    }
  }
  return undefined;
}

function toProject(
  category: string,
  projectBaseName: string,
  data: Record<string, unknown>,
): Project {
  const projectSlug = `${slugify(category, { lower: true })}/${slugify(
    projectBaseName,
    {
      lower: true,
    },
  )}`;

  let cover: string | undefined;
  const coverVal = (data as Record<string, unknown>).coverImage;
  if (typeof coverVal === "string") cover = coverVal as string;

  return {
    title: String(data.title ?? projectBaseName),
    shortDescription: data.shortDescription
      ? String(data.shortDescription)
      : undefined,
    longDescription: data.longDescription
      ? String(data.longDescription)
      : undefined,
    coverImage: cover,
    galleryImages: Array.isArray(data.galleryImages)
      ? (data.galleryImages as unknown[]).map(String)
      : undefined,
    isFeatured:
      typeof data.isFeatured === "boolean"
        ? (data.isFeatured as boolean)
        : undefined,
    date: data.date ? String(data.date) : undefined,
    platform: data.platform ? String(data.platform) : undefined,
    externalTech: Array.isArray(data.externalTech)
      ? (data.externalTech as unknown[]).map(String)
      : undefined,
    tags: Array.isArray(data.tags)
      ? (data.tags as unknown[]).map(String)
      : undefined,
    authors: Array.isArray(data.authors)
      ? (data.authors as Array<Record<string, unknown>>).map((a) => ({
          name: String(a.name ?? ""),
          url: a.url != null ? String(a.url) : undefined,
          avatar: a.avatar != null ? String(a.avatar) : undefined,
        }))
      : undefined,
    demoUrl: data.demoUrl ? String(data.demoUrl) : undefined,
    repoUrl: data.repoUrl ? String(data.repoUrl) : undefined,
    videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
    xUrl: data.xUrl ? String(data.xUrl) : undefined,
    useCases: Array.isArray(data.useCases)
      ? (data.useCases as unknown[]).map(String)
      : undefined,
    category,
    slug: projectSlug,
  };
}

function findProjectYamlFile(
  projectDir: string,
  projectFolderName: string,
): string | null {
  const candidates = [
    path.join(projectDir, "meta.yml"),
    path.join(projectDir, "meta.yaml"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

function loadAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_BASE_DIR)) return [];

  const categories = fs
    .readdirSync(PROJECTS_BASE_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const all: Project[] = [];
  for (const category of categories) {
    const categoryDir = path.join(PROJECTS_BASE_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });

    // Only project subdirectories with meta.yml/meta.yaml
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const projectFolderName = entry.name;
      const projectDir = path.join(categoryDir, projectFolderName);
      const yamlPath = findProjectYamlFile(projectDir, projectFolderName);
      if (!yamlPath) continue;
      const raw = readYamlFile(yamlPath);
      if (!raw) continue;
      all.push(toProject(category, projectFolderName, raw));
    }
  }
  return all;
}

const cachedProjects: Project[] = loadAllProjects();

export function getSections(): Section[] {
  const byCategory = new Map<string, Project[]>();
  for (const project of cachedProjects) {
    const arr = byCategory.get(project.category) ?? [];
    arr.push(project);
    byCategory.set(project.category, arr);
  }

  const sections: Section[] = Array.from(byCategory.entries()).map(
    ([category, items]) => ({
      tag: category,
      slug: slugify(category, { lower: true }),
      projects: items.sort((a, b) =>
        (b.date ?? "").localeCompare(a.date ?? ""),
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
