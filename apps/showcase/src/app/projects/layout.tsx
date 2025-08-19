import { Menu } from "@/components/menu";
import { getSections } from "@showcase/data/projects";
import { Suspense } from "react";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const sections = getSections();
  return (
    <div className="flex w-full min-h-screen pt-14">
      <div className="hidden md:flex sticky top-14 h-[calc(100vh-3.5rem)]">
        <Menu sections={sections} />
      </div>
      <main className="flex-1 p-6 pt-0 space-y-6">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  );
} 