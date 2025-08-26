import { ProjectCard } from "@/components/project-card";
import { Card } from "@/components/ui/card";
import { getProfileBySlug } from "@showcase/data/profiles";
import { getAllProjects } from "@showcase/data/projects";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const user = getProfileBySlug(params.slug);
  if (!user) {
    return {
      title: "User not found",
    };
  }
  return {
    title: user.name,
    description: user.bio || `${user.name}'s profile`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const user = getProfileBySlug(params.slug);
  const all = getAllProjects();

  if (!user) {
    notFound();
  }

  const projects = all.filter((p) => (p.authorIds ?? []).includes(params.slug));

  return (
    <div className="flex w-full min-h-screen pt-14">
      <main className="flex-1 p-6 pt-0 space-y-8 max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

          <div className="relative flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#141414] to-[#0A0A0A] ring-1 ring-white/10">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-medium text-white/60">
                    {user.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              {user.isElevenLabs && (
                <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-purple-500/25">
                  <span className="text-[10px] font-medium text-white">
                    ELEVENLABS
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-medium tracking-[-0.02em] text-white flex items-center gap-2">
                  {user.name}
                  <svg
                    className="w-6 h-6 inline-block text-blue-500 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                  </svg>
                  {user.isElevenLabs && (
                    <Image
                      src="/assets/badges/organisation.jpg"
                      alt="ElevenLabs"
                      className="w-6 h-6 inline-block rounded-md"
                      width={24}
                      height={24}
                    />
                  )}
                </h1>
                {user.isElevenLabs && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-xs font-medium text-white/80">
                      ElevenLabs Team
                    </span>
                  </div>
                )}
              </div>

              {user.bio && (
                <p className="text-[15px] leading-relaxed text-white/60 mb-4">
                  {user.bio}
                </p>
              )}

              {user.location && (
                <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{user.location}</span>
                </div>
              )}

              {/* Social Links */}
              {user.socials?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-all"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Website
                    </a>
                  )}
                  {user.socials.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-all"
                    >
                      {s.label.toLowerCase() === "github" && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                      {s.label.toLowerCase() === "x" && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {s.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Projects Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium text-white">Projects</h2>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
              {projects.length}
            </span>
          </div>

          {projects.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-12 text-center">
              <div className="text-white/20 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/40">No projects listed yet.</p>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
