import { Metadata } from "next"

import { ElevenLabsLogo } from "@/components/elevenlabs-logo"
import { FeaturedNav } from "@/components/featured-nav"
import { PageHeader, PageHeaderDescription } from "@/components/page-header"
import { PageNav } from "@/components/page-nav"
import { ShowcaseCTA } from "@/components/showcase-cta"

export const dynamic = "force-static"
export const revalidate = false

const title = "Agents"
const description =
  "Explore a curated gallery of voice and audio experiences powered by ElevenLabs Agents. Discover what creators and teams are shipping today."

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

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader>
        <ElevenLabsLogo text={title} />
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <ShowcaseCTA />
      </PageHeader>
      <PageNav id="examples">
        <FeaturedNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
      </PageNav>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="theme-container">{children}</section>
        </div>
      </div>
    </>
  )
}
