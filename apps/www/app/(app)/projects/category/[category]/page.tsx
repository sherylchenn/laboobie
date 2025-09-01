import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  categories,
  getCategoryById,
  type CategoryId,
} from "@showcase/data/categories"

import { getProjectsByCategory } from "@/lib/projects"
import { CategoryIcon } from "@/components/category-icon"
import { ProjectList } from "@/components/project-list"

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const categoryData = getCategoryById(category)

  if (!categoryData) {
    return {
      title: "Category Not Found",
      description: "The category you're looking for doesn't exist.",
    }
  }

  return {
    title: `${categoryData.name} Projects`,
    description: `Explore projects built with ElevenLabs ${categoryData.name.toLowerCase()}`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categoryData = getCategoryById(category)

  if (!categoryData) {
    notFound()
  }

  const projects = await getProjectsByCategory(category as CategoryId)

  return (
    <div className="flex flex-1 flex-col">
      <div className="h-(--top-spacing) shrink-0" />
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 lg:py-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <CategoryIcon src={categoryData.iconSrc} size="lg" />
            <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
              {categoryData.name}
            </h1>
          </div>
          <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            Explore projects built with ElevenLabs{" "}
            {categoryData.name.toLowerCase()}
          </p>
        </div>

        <div className="w-full flex-1">
          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
