import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export default async function VoicesPage() {
  const projects = await getProjectsByCategory("voices")

  return <ProjectList projects={projects} />
}