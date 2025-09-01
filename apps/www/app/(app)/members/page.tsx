import { Metadata } from "next"
import Link from "next/link"
import { getAuthorSectionsByInitial } from "@showcase/data/api/authors-list"

import { AuthorListWithSections } from "@/components/author-list-with-sections"
import { ElevenLabsLogo } from "@/components/elevenlabs-logo"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Community Members"
const description =
  "Meet the incredible people contributing to our showcase. Explore projects and contributions from our growing community."

export const dynamic = "force-static"
export const revalidate = false

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

export default function MembersPage() {
  const sections = getAuthorSectionsByInitial()

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <ElevenLabsLogo text={title} />
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/projects/installation">Become a Member</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/projects">View Projects</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="theme-container py-8">
            <AuthorListWithSections sections={sections} />
          </section>
        </div>
      </div>
    </div>
  )
}
