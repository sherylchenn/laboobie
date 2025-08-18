import { Menu } from "@/components/menu";
import { ProjectList } from "@/components/project-list";
import { Tabs } from "@/components/tabs";
import { getSections } from "@showcase/data/projects";
import { Suspense } from "react";

const sections = getSections();

export default function Page() {
  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        <Suspense fallback={null}>
          <ProjectList sections={sections} />
        </Suspense>
      </main>
    </div>
  );
}
