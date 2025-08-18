import { Menu } from "@/components/menu";
import { ProjectList } from "@/components/project-list";
import { Tabs } from "@/components/tabs";
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

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        <ProjectList sections={data ? [data] : []} isPage />
      </main>
    </div>
  );
}
