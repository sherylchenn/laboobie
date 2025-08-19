import { Menu } from "@/components/menu";
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
  const sections = getSections();

  return (
    <div className="flex w-full h-full pt-4 md:pt-16">
      <div className="hidden md:flex sticky top-4 md:top-0 h-[calc(100vh-3rem)]">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-0 space-y-8">
        <ProjectList sections={data ? [data] : []} />
      </main>
    </div>
  );
}
