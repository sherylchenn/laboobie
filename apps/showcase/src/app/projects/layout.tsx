import { Menu } from "@/components/menu";
import { getSections } from "@showcase/data/projects";
import { Suspense } from "react";

export default function ProjectsLayout({
  children,
}: { children: React.ReactNode }) {
  const sections = getSections();
  return (
    <div
      className="flex w-full min-h-screen pt-14"
      style={{ "--menu-left": "1.5rem" } as React.CSSProperties}
    >
      <div className="hidden md:block shrink-0 w-64">
        <Menu sections={sections} />
      </div>
      <main className="flex-1 p-6 pt-0 space-y-6">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  );
}
