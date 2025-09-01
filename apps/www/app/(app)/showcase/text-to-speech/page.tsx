import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

export default async function TextToSpeechPage() {
  const projects = await getProjectsByCategory("text-to-speech")

  return <ProjectList projects={projects} />
}