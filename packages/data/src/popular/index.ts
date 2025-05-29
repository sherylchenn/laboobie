import { redis } from "@directories/kv/redis";
import { getSections } from "../samples";

export async function getPopularSamples() {
  const sections = getSections();

  const sectionsWithCounts = await Promise.all(
    sections.map(async (section) => {
      const samplesWithCounts = await Promise.all(
        section.samples.map(async (sample) => {
          const count = await redis.get(`samples:${sample.slug}`);
          return {
            ...sample,
            count: Number(count) || 0,
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
