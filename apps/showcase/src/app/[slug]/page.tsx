import { Menu } from "@/components/menu";
import { ProjectCard } from "@/components/project-card";
import type { Metadata } from "next";
import {
  getProjectBySlug,
  getSections,
} from "../../../../../packages/data/src/projects";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project does not exist.",
    };
  }

  const title = project.title;
  const description = project.shortDescription ?? project.longDescription ?? "";
  const cover = project.coverImage ?? "/card.png";
  const url = `/${project.slug}`;
  const authors = (project.authors ?? []).map((a) => ({
    name: a.name,
    url: a.url ?? undefined,
  }));
  const keywords = [
    ...(project.tags ?? []),
    ...(project.externalTech ?? []),
    ...(project.useCases ?? []),
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    authors,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: cover }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cover],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const sections = getSections();

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-16">
        <ProjectCard project={project} />
      </main>
    </div>
  );
}

export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)
