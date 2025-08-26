import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import YAML from "yaml";

// Resolve workspace root (same logic as projects)
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT
  ? path.resolve(process.env.WORKSPACE_ROOT)
  : path.resolve(
      process.cwd(),
      process.cwd().includes(`${path.sep}apps${path.sep}`) ? "../.." : ".",
    );

// Profiles directory at the root
const PROFILES_DIR = process.env.PROFILES_DIR
  ? path.resolve(process.env.PROFILES_DIR)
  : path.resolve(WORKSPACE_ROOT, "profiles");

export type Profile = {
  // Identity
  name: string;
  slug: string; // from filename or name
  avatar?: string;
  url?: string;
  bio?: string;
  location?: string;
  isElevenLabs?: boolean; // Official ElevenLabs employee

  // Socials
  socials?: Array<{
    label: string;
    url: string;
  }>;

  // Projects owned by the profile; slugs should match `@showcase/data/projects`
  projects?: string[];

  // Tags/areas
  tags?: string[];
};

function isYamlFile(filename: string): boolean {
  return filename.endsWith(".yml") || filename.endsWith(".yaml");
}

function parseProfile(filePath: string): Profile | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = YAML.parse(fileContent) as Record<string, unknown> | null;
    if (!data) return null;

    const basename = path.basename(filePath, path.extname(filePath));

    const name = typeof data.name === "string" ? data.name : undefined;
    if (!name) {
      console.warn(`Profile missing required name in ${filePath}`);
      return null;
    }

    const slugFromName = slugify(name, { lower: true });
    const slug = slugify(basename, { lower: true }) || slugFromName;

    const avatar = typeof data.avatar === "string" ? data.avatar : undefined;
    const url = typeof data.url === "string" ? data.url : undefined;
    const bio = typeof data.bio === "string" ? data.bio : undefined;
    const location =
      typeof data.location === "string" ? data.location : undefined;
    const isElevenLabs =
      typeof data.isElevenLabs === "boolean" ? data.isElevenLabs : undefined;

    const socials = Array.isArray((data as any).socials)
      ? (((data as any).socials as Array<Record<string, unknown>>)
          .map((s) => {
            const label = typeof s.label === "string" ? s.label : undefined;
            const url = typeof s.url === "string" ? s.url : undefined;
            if (!label || !url) return null;
            return { label, url };
          })
          .filter(Boolean) as Array<{ label: string; url: string }>)
      : undefined;

    const projects = Array.isArray((data as any).projects)
      ? ((data as any).projects as unknown[]).map(String)
      : undefined;

    const tags = Array.isArray((data as any).tags)
      ? ((data as any).tags as unknown[]).map(String)
      : undefined;

    return {
      name,
      slug,
      avatar,
      url,
      bio,
      location,
      isElevenLabs,
      socials,
      projects,
      tags,
    };
  } catch (error) {
    console.error(`Failed to parse profile file ${filePath}:`, error);
    return null;
  }
}

function loadAllProfiles(): Profile[] {
  if (!fs.existsSync(PROFILES_DIR)) {
    console.warn(`Profiles directory not found: ${PROFILES_DIR}`);
    return [];
  }

  const files = fs.readdirSync(PROFILES_DIR);
  const profiles: Profile[] = [];

  for (const file of files) {
    if (!isYamlFile(file)) continue;
    const filePath = path.join(PROFILES_DIR, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;
    const profile = parseProfile(filePath);
    if (profile) profiles.push(profile);
  }

  return profiles;
}

const cachedProfiles: Profile[] = loadAllProfiles();

export function getAllProfiles(): Profile[] {
  return cachedProfiles;
}

export function getProfileBySlug(slug: string): Profile | undefined {
  return cachedProfiles.find((u) => u.slug === slug);
}

export function getProfilesWithProjects(): Profile[] {
  return cachedProfiles.filter((u) => (u.projects?.length ?? 0) > 0);
}

export type ProfileSection = {
  tag: string; // e.g., initial letter or tag bucket
  slug: string; // slugified tag
  profiles: Profile[];
};

export function getProfileSectionsByInitial(): ProfileSection[] {
  const byInitial = new Map<string, Profile[]>();
  for (const profile of cachedProfiles) {
    const initial = profile.name?.[0]?.toUpperCase() ?? "?";
    const arr = byInitial.get(initial) || [];
    arr.push(profile);
    byInitial.set(initial, arr);
  }

  const sections: ProfileSection[] = Array.from(byInitial.entries()).map(
    ([initial, items]) => ({
      tag: initial,
      slug: slugify(initial, { lower: true }),
      profiles: items.sort((a, b) => a.name.localeCompare(b.name)),
    }),
  );

  return sections.sort((a, b) => a.tag.localeCompare(b.tag));
}
