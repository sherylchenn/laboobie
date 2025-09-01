import { Metadata } from "next"
import { getProjects } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export const metadata: Metadata = {
  title: "All Projects",
  description: "All projects and experiments built with ElevenLabs APIs",
}

export default async function AllProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="flex flex-1 flex-col">
      <div className="h-(--top-spacing) shrink-0" />
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 lg:py-8">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            All Projects
          </h1>
          <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            Browse all projects built with ElevenLabs APIs
          </p>
        </div>
        
        <div className="w-full flex-1">
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  )
}