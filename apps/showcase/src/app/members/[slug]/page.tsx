import { ProjectCard } from "@/components/project-card";
import { getProfileBySlug } from "@showcase/data/profiles";
import { getAllProjects } from "@showcase/data/projects";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const user = getProfileBySlug(slug);
  const title = user ? `${user.name} · Members` : "User not found";
  const description = user?.bio ?? "Projects by user";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const user = getProfileBySlug(slug);
  const all = getAllProjects();

  if (!user) {
    return <div className="pt-14 p-6">User not found</div>;
  }

  const projects = all.filter((p) => (p.authorIds ?? []).includes(slug));

  return (
    <div className="flex w-full min-h-screen pt-14">
      <main className="flex-1 p-6 pt-0 space-y-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
            )}
          </div>
        </div>

        {user.socials?.length ? (
          <div className="flex gap-3 text-sm text-muted-foreground">
            {user.socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        ) : null}

        <section>
          <h2 className="text-md text-foreground/80 mb-3">Projects</h2>
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
            {projects.length ? (
              projects.map((p) => <ProjectCard key={p.slug} project={p} />)
            ) : (
              <div className="text-sm text-muted-foreground">
                No projects listed yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
