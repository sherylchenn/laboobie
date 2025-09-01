import { Metadata } from "next"

import { getFeaturedProjects } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export const metadata: Metadata = {
  title: "Featured Projects",
  description: "Featured projects and experiments built with ElevenLabs",
}

export default async function ProjectsPage() {
  const projects = await getFeaturedProjects()

  return (
    <div className="flex flex-1 flex-col">
      <div className="h-(--top-spacing) shrink-0" />
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 lg:py-8">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            Featured Projects
          </h1>
          <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            Hand-picked projects showcasing the best use of ElevenLabs
          </p>
        </div>

        <div className="w-full flex-1">
          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No featured projects yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
