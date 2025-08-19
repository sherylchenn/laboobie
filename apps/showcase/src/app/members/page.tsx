import { getProfileSectionsByInitial } from "@showcase/data/profiles";
import { getAllProjects } from "@showcase/data/projects";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function Page() {
  const sections = getProfileSectionsByInitial();
  const allProjects = getAllProjects();
  const counts = new Map<string, number>();
  for (const project of allProjects) {
    for (const id of project.authorIds ?? []) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return (
    <div className="flex w-full min-h-screen pt-14">
      <main className="flex-1 p-6 pt-0 space-y-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Members</h1>
        {sections.map((section) => (
          <section key={section.tag} className="space-y-4">
            <h2 className="text-md text-foreground/80">{section.tag}</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {section.profiles.map((u) => (
                <Link
                  key={u.slug}
                  href={`/members/${u.slug}`}
                  className="rounded-lg border border-border/60 p-4 bg-background hover:opacity-90 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">
                          {u.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{u.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {counts.get(u.slug) ?? 0} project
                        {(counts.get(u.slug) ?? 0) === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
