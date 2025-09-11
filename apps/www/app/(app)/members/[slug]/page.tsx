import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllAuthors, getAuthorBySlug } from "@showcase/data/authors"
import {
  IconArrowLeft,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconExternalLink,
} from "@tabler/icons-react"
import { GalleryVerticalEnd, MapPin } from "lucide-react"

import { getProjectsByAuthor } from "@/lib/projects"
import { ProjectList } from "@/components/project-list"
import { ShareButtons } from "@/components/share-buttons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card } from "@/registry/new-york-v4/ui/card"

export const dynamic = "force-static"
export const revalidate = false

export function generateStaticParams() {
  const authors = getAllAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)

  if (!author) {
    return {
      title: "Member Not Found",
      description: "The member you're looking for doesn't exist.",
    }
  }

  return {
    title: author.name,
    description:
      author.bio || `View projects and contributions by ${author.name}`,
    openGraph: {
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            author.name
          )}&description=${encodeURIComponent(
            author.bio || `View projects and contributions by ${author.name}`
          )}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            author.name
          )}&description=${encodeURIComponent(
            author.bio || `View projects and contributions by ${author.name}`
          )}`,
        },
      ],
    },
  }
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const projects = await getProjectsByAuthor(author.slug)

  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "github":
        return <IconBrandGithub className="size-4" />
      case "x":
        return <IconBrandX className="size-4" />
      case "linkedin":
        return <IconBrandLinkedin className="size-4" />
      default:
        return <IconExternalLink className="size-4" />
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact header with back button */}
      <div className="container-wrapper px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <Button asChild size="sm" variant="ghost" className="-ml-2">
            <Link href="/members">
              <IconArrowLeft className="size-4" />
              Members
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content - blog post width */}
      <div className="container-wrapper flex-1 px-6 pb-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Author Card */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar className="ring-border size-20 ring-2">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-xl">
                    {author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold">{author.name}</h1>
                      {author.isElevenLabs && (
                        <Image
                          src="/badges/elevenlabs.jpg"
                          alt="ElevenLabs"
                          width={18}
                          height={18}
                          className="rounded-xs invert dark:invert-0"
                        />
                      )}
                      <svg
                        className="h-5 w-5 fill-current text-blue-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                      </svg>
                    </div>
                    {author.bio && (
                      <p className="text-muted-foreground mt-1">{author.bio}</p>
                    )}
                    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                      {author.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {author.location}
                        </span>
                      )}
                      {projects.length > 0 && (
                        <span className="flex items-center gap-1">
                          <GalleryVerticalEnd className="h-3 w-3" />
                          {projects.length}{" "}
                          {projects.length === 1 ? "project" : "projects"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {author.url && (
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={author.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconExternalLink className="size-4" />
                          Website
                        </Link>
                      </Button>
                    )}
                    {author.socials?.map((social) => (
                      <Button
                        key={social.url}
                        asChild
                        size="sm"
                        variant="outline"
                      >
                        <Link
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {getSocialIcon(social.label)}
                          {social.label}
                        </Link>
                      </Button>
                    ))}
                    {(author.url || author.socials?.length > 0) && (
                      <div className="bg-border h-4 w-px" />
                    )}
                    <ShareButtons
                      url={`${process.env.NEXT_PUBLIC_APP_URL || "https://showcase.eleven-labs.com"}/members/${author.slug}`}
                      title={author.name}
                      description={
                        author.bio ||
                        `View projects and contributions by ${author.name}`
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Projects Section */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-muted-foreground mb-6 text-lg font-semibold">
                Projects
              </h2>
              <ProjectList projects={projects} small />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
