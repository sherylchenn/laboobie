import { ProjectList } from "@/components/project-list";
import { getSectionBySlug, getSections } from "@showcase/data/projects";

type Params = Promise<{ section: string }>;

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export async function generateMetadata({ params }: { params: Params }) {
  const { section } = await params;

  const data = getSectionBySlug(section);

  return {
    title: `Rules for ${data?.tag} | Cursor Directory`,
    description: `Cursor rules for ${data?.tag}, a collection of rules for Cursor.`,
  };
}

export async function generateStaticParams() {
  return getSections().map((section) => ({
    section: section.slug,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { section } = await params;

  const data = getSectionBySlug(section);

  return <ProjectList sections={data ? [data] : []} />;
}
