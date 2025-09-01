import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export default async function SpeechToTextPage() {
  const projects = await getProjectsByCategory("speech-to-text")

  return <ProjectList projects={projects} />
}