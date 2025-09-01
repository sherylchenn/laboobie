import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export default async function MusicPage() {
  const projects = await getProjectsByCategory("music")

  return <ProjectList projects={projects} />
}