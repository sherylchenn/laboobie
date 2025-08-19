import { ProjectList } from "@/components/project-list";
import { getSections } from "@showcase/data/projects";
import { Sparkles } from "lucide-react";

const allSections = getSections();
const featuredOnly = allSections
  .map((s) => ({ ...s, projects: s.projects.filter((p) => p.isFeatured) }))
  .filter((s) => s.projects.length > 0);

export default function Page() {
  return (
    <>
      <div className="mb-2 flex items-center gap-2 text-md font-regular text-foreground/80">
        <Sparkles className="h-3.5 w-3.5 text-[#666] dark:text-[#999]" />
        Featured
      </div>
      <ProjectList sections={featuredOnly} />
    </>
  );
}
