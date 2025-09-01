import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export default async function ConversationalAIPage() {
  const projects = await getProjectsByCategory("agents")

  return <ProjectList projects={projects} />
}
