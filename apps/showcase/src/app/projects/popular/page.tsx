import { Menu } from "@/components/menu";
import { ProjectList } from "@/components/project-list";
import { Tabs } from "@/components/tabs";
import { getPopularProjects } from "@showcase/data/popular";
import { getSections } from "@showcase/data/projects";

export const metadata = {
  title: "Popular projects",
  description: "Popular projects from v3.",
};

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export default async function Page() {
  const popularProjects = await getPopularProjects();
  const sections = getSections();

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        <ProjectList sections={popularProjects} />
      </main>
    </div>
  );
}
