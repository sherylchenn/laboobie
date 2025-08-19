import { getSections } from "../projects";

export async function getPopularProjects() {
  const sections = getSections();
  return sections;
}
