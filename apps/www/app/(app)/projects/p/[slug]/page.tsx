import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import { Author, getAuthorById } from "@showcase/data/authors"
import { getCategoryById } from "@showcase/data/categories"
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconPlayerPlay,
  IconWorld,
} from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/server"

import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { CategoryPill } from "@/components/category-pill"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { DocsTableOfContents } from "@/components/docs-toc"
import { LoadingImage } from "@/components/loading-image"
import { OpenInV0Cta } from "@/components/open-in-v0-cta"
import { ShareButtons } from "@/components/share-buttons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  const pages = source.getPages()
  return pages.map((page) => ({
    slug: page.slugs[page.slugs.length - 1],
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = source.getPage([params.slug])

  if (!page) {
    notFound()
  }

  const doc = page.data

  if (!doc.title || !doc.description) {
    notFound()
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
      creator: "@shadcn",
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = source.getPage([params.slug])
  if (!page) {
    notFound()
  }

  const doc = page.data
  // @ts-expect-error - revisit fumadocs types.
  const MDX = doc.body
  const neighbours = await findNeighbour(source.pageTree, page.url)

  // @ts-expect-error - revisit fumadocs types.
  const links = doc.links

  // Fetch authors
  // @ts-expect-error - revisit fumadocs types.
  const authorIds = doc.authorIds || []
  const authors = await Promise.all(
    authorIds.map(async (id: string) => {
      const author = await getAuthorById(id)
      return author
    })
  )
  const validAuthors = authors.filter(Boolean)

  return (
    <div
      data-slot="docs"
      className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                    {doc.title}
                  </h1>
                  {/* Categories - moved under title */}
                  {/* @ts-expect-error - revisit fumadocs types. */}
                  {doc.categories && doc.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {/* @ts-expect-error - revisit fumadocs types. */}
                      {doc.categories.map((categoryId: string) => {
                        const category = getCategoryById(categoryId)
                        return (
                          <CategoryPill
                            key={categoryId}
                            iconSrc={category?.iconSrc}
                            href={category?.extHref}
                            asLink={true}
                            className="px-2 py-1 text-xs"
                          >
                            {category?.name || categoryId}
                          </CategoryPill>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                  <DocsCopyPage
                    // @ts-expect-error - revisit fumadocs types.
                    page={doc.content}
                    url={absoluteUrl(page.url)}
                  />
                  <ShareButtons
                    url={absoluteUrl(page.url)}
                    title={doc.title}
                    description={doc.description}
                  />
                  {neighbours.previous && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target ml-auto size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={neighbours.previous.url}>
                        <IconArrowLeft />
                        <span className="sr-only">Previous</span>
                      </Link>
                    </Button>
                  )}
                  {neighbours.next && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={neighbours.next.url}>
                        <span className="sr-only">Next</span>
                        <IconArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {doc.description && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {doc.description}
                </p>
              )}

              {/* Authors */}
              {validAuthors.length > 0 && (
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <div className="flex items-center gap-4">
                      {validAuthors.map((author: Author, i: number) => {
                        const initials = author.name
                          .split(" ")
                          .map((p: string) => p[0] ?? "")
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()

                        return (
                          <div
                            key={`${author.name}-${i}`}
                            className="flex items-center gap-3"
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/members/${authorIds[i]}`}
                                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                                >
                                  <Avatar className="ring-border h-8 w-8 ring-1 sm:h-10 sm:w-10">
                                    <AvatarImage
                                      src={author.avatar}
                                      alt={author.name}
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-muted text-xs">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {author.name}
                                    </span>
                                    {author.bio && (
                                      <span className="text-muted-foreground text-xs">
                                        {author.bio}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                View {author.name}&apos;s profile
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              )}

              {/* Project Image */}
              {/* @ts-expect-error - revisit fumadocs types. */}
              {doc.image && (
                <div className="my-4">
                  <LoadingImage
                    // @ts-expect-error - revisit fumadocs types.
                    src={doc.image}
                    alt={doc.title}
                    containerClassName="ring-border ring-1"
                    priority
                  />
                </div>
              )}

              {/* Project Links */}
              {/* @ts-expect-error - revisit fumadocs types. */}
              {(doc.demoUrl || doc.repoUrl || doc.videoUrl) && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* @ts-expect-error - revisit fumadocs types. */}
                  {doc.demoUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="h-8 gap-1.5 px-3 text-xs"
                    >
                      <Link
                        href={doc.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconWorld className="h-3.5 w-3.5" />
                        Demo
                      </Link>
                    </Button>
                  )}
                  {/* @ts-expect-error - revisit fumadocs types. */}
                  {doc.repoUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="h-8 gap-1.5 px-3 text-xs"
                    >
                      <Link
                        href={doc.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconBrandGithub className="h-3.5 w-3.5" />
                        Code
                      </Link>
                    </Button>
                  )}
                  {/* @ts-expect-error - revisit fumadocs types. */}
                  {doc.videoUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="h-8 gap-1.5 px-3 text-xs"
                    >
                      <Link
                        href={doc.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconPlayerPlay className="h-3.5 w-3.5" />
                        Video
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
            {links ? (
              <div className="flex items-center space-x-2 pt-4">
                {links?.doc && (
                  <Badge asChild variant="secondary">
                    <Link href={links.doc} target="_blank" rel="noreferrer">
                      Docs <IconArrowUpRight />
                    </Link>
                  </Badge>
                )}
                {links?.api && (
                  <Badge asChild variant="secondary">
                    <Link href={links.api} target="_blank" rel="noreferrer">
                      API Reference <IconArrowUpRight />
                    </Link>
                  </Badge>
                )}
              </div>
            ) : null}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
          {neighbours.previous && (
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="shadow-none"
            >
              <Link href={neighbours.previous.url}>
                <IconArrowLeft /> {neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              asChild
            >
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <IconArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {/* @ts-expect-error - revisit fumadocs types. */}
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            {/* @ts-expect-error - revisit fumadocs types. */}
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-12 px-6">
          <OpenInV0Cta />
        </div>
      </div>
    </div>
  )
}
