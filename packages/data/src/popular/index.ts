import { getSections } from "../samples";

export async function getPopularSamples() {
  const sections = getSections();

  const sectionsWithCounts = await Promise.all(
    sections.map(async (section) => {
      const samplesWithCounts = await Promise.all(
        section.samples.map(async (sample) => {
          return {
            ...sample,
            count: 0,
          };
        }),
      );

      const sortedSamples = samplesWithCounts.sort((a, b) => b.count - a.count);
      const totalCount = sortedSamples.reduce(
        (sum, sample) => sum + sample.count,
        0,
      );

      return {
        ...section,
        samples: sortedSamples,
        totalCount,
      };
    }),
  );

  return sectionsWithCounts.sort((a, b) => b.totalCount - a.totalCount);
}
