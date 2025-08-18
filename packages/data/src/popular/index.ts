import { getSections } from "../projects";

export async function getPopularProjects() {
  const sections = getSections();
  // For now, simply return sections sorted by project count (already sorted in getSections)
  return sections;
}
