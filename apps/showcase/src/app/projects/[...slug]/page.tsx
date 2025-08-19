import { Markdown } from "@/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProjectBySlug, getSections } from "@showcase/data/projects";
import type { Metadata } from "next";
import Link from "next/link";

function formatDate(input?: string): string | undefined {
  if (!input) return undefined;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Params = Promise<{ slug: string[] }>;

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const joined = slug.join("/");
  const project = getProjectBySlug(joined);

  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project does not exist.",
    };
  }

  const title = project.title;
  const description = project.description ?? "";
  const cover = project.image ?? "/card.png";
  const url = `/projects/${project.slug}`;
  const authors = (project.authors ?? []).map((a) => ({
    name: a.name,
    url: a.url ?? undefined,
  }));
  const keywords = [
    ...(project.tags ?? []),
    ...(project.technologies ?? []),
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
  const joined = slug.join("/");
  const project = getProjectBySlug(joined);
  const sections = getSections();

  if (!project) {
    return <div>Project not found</div>;
  }

  const date = formatDate(project.date);
  return (
    <div className="flex w-full h-full pt-4">
      <main className="flex-1 pt-0">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-3 leading-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-base text-muted-foreground mb-4">
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
              {project.authors?.length ? (
                <div className="flex items-center">
                  {project.authors.slice(0, 3).map((a) => {
                    const initials = a.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div key={a.name} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {a.avatar ? (
                            <AvatarImage src={a.avatar} alt={a.name} />
                          ) : (
                            <AvatarFallback>{initials}</AvatarFallback>
                          )}
                        </Avatar>
                        {a.url ? (
                          <Link
                            href={a.url}
                            target="_blank"
                            className="hover:underline"
                          >
                            {a.name}
                          </Link>
                        ) : (
                          <span>{a.name}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {date && <span>•</span>}
              {date && <span>{date}</span>}
            </div>
          </header>

          {project.image && (
            <div className="w-full mb-8 overflow-hidden rounded-md bg-[#0A0A0A]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <Markdown content={project.markdown} />
        </div>
      </main>
    </div>
  );
}

export const dynamic = "force-static";
export const revalidate = 86400;
