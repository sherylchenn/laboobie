import { Metadata } from "next"

import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

const title = "Voices"
const description =
  "Explore a curated gallery of voice and audio experiences powered by ElevenLabs. Discover what developers and teams are shipping today."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default async function VoicesPage() {
  const projects = await getProjectsByCategory("voices")

  return <ProjectList projects={projects} />
}