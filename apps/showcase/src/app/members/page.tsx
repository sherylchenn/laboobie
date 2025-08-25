import { getProfileSectionsByInitial } from "@showcase/data/profiles";
import { getAllProjects } from "@showcase/data/projects";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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
      <main className="flex-1 p-6 pt-0 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative">
          <h1 className="text-4xl font-medium tracking-[-0.02em] text-white mb-2">
            Members
          </h1>
          <p className="text-[15px] text-white/60">
            Explore the talented individuals building amazing projects
          </p>
        </div>

        {/* Members Grid by Section */}
        {sections.map((section) => (
          <section key={section.tag} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
                {section.tag}
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.profiles.map((u) => (
                <Link
                  key={u.slug}
                  href={`/members/${u.slug}`}
                  className="group relative"
                >
                  <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] p-5 transition-all duration-200 hover:border-white/20 hover:bg-[#0D0D0D] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
                    {/* Subtle gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-200" />
                    
                    <div className="relative flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#141414] to-[#0A0A0A] ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-sm font-medium text-white/40">
                              {u.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        {u.isElevenLabs && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-purple-500/25 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-[15px] text-white truncate group-hover:text-white transition-colors">
                            {u.name}
                          </h3>
                        </div>
                        
                        {u.isElevenLabs && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span className="text-[10px] font-medium text-white/70">
                              TEAM
                            </span>
                          </div>
                        )}
                        
                        {u.bio && (
                          <p className="text-xs text-white/40 line-clamp-2 mb-2">
                            {u.bio}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs">
                          {counts.get(u.slug) ? (
                            <div className="flex items-center gap-1.5 text-white/40">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span>{counts.get(u.slug)} project{(counts.get(u.slug) ?? 0) === 1 ? "" : "s"}</span>
                            </div>
                          ) : null}
                          
                          {u.location && (
                            <div className="flex items-center gap-1.5 text-white/40">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{u.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}