import { Menu } from "@/components/menu";
import { ProjectList } from "@/components/project-list";
import { getSections } from "@showcase/data/projects";
import { Suspense } from "react";

const sections = getSections();

export default function Page() {
  return (
    <div className="flex w-full h-full pt-4 md:pt-16">
      <div className="hidden md:flex sticky top-4 md:top-0 h-[calc(100vh-3rem)]">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-0 space-y-8">
        <Suspense fallback={null}>
          <ProjectList sections={sections} />
        </Suspense>
      </main>
    </div>
  );
}
