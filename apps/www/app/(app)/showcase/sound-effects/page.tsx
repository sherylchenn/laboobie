import { Metadata } from "next"

import { getProjectsByCategory } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"

const title = "Sound effects"
const description =
  "Explore a curated gallery of sound effect experiences powered by ElevenLabs. Discover what developers and teams are shipping today."

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

export default async function SoundEffectsPage() {
  const projects = await getProjectsByCategory("sound-effects")

  return <ProjectList projects={projects} />
}
