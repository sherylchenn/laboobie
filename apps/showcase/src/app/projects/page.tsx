import { ProjectList } from "@/components/project-list";
import { getSections } from "@showcase/data/projects";

const allSections = getSections();
const featuredOnly = allSections
  .map((s) => ({ ...s, projects: s.projects.filter((p) => p.isFeatured) }))
  .filter((s) => s.projects.length > 0);

export default function Page() {
  return <ProjectList sections={featuredOnly} />;
}
