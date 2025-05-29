import { redis } from "@directories/kv/redis";
import { getSections } from "../samples";

export async function getPopularRules() {
  const sections = getSections();

  const sectionsWithCounts = await Promise.all(
    sections.map(async (section) => {
      const rulesWithCounts = await Promise.all(
        section.samples.map(async (sample) => {
          const count = await redis.get(`rules:${sample.slug}`);
          return {
            ...sample,
            count: Number(count) || 0,
          };
        }),
      );

      const sortedRules = rulesWithCounts.sort((a, b) => b.count - a.count);
      const totalCount = sortedRules.reduce(
        (sum, sample) => sum + sample.count,
        0,
      );

      return {
        ...section,
        rules: sortedRules,
        totalCount,
      };
    }),
  );

  return sectionsWithCounts.sort((a, b) => b.totalCount - a.totalCount);
}
