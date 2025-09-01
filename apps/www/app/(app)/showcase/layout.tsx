import { ElevenLabsLogo } from "@/components/elevenlabs-logo"
import { FeaturedNav } from "@/components/featured-nav"
import { PageHeader, PageHeaderDescription } from "@/components/page-header"
import { PageNav } from "@/components/page-nav"
import { ShowcaseCTA } from "@/components/showcase-cta"

export const dynamic = "force-static"
export const revalidate = false

const description =
  "Explore a curated gallery of voice and audio experiences powered by ElevenLabs. Discover what developers and teams are shipping today."

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <ElevenLabsLogo text="Showcase" />
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <ShowcaseCTA />
      </PageHeader>
      <PageNav>
        <FeaturedNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
      </PageNav>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="theme-container">{children}</section>
        </div>
      </div>
    </div>
  )
}
