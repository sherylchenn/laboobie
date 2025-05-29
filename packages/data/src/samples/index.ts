import slugify from "slugify";
import { audioBookSamples } from "./audioBook";
import { dialogueSamples } from "./dialogue";
import { expressiveSamples } from "./expressive";

export const samples: Sample[] = [
  ...audioBookSamples,
  ...dialogueSamples,
  ...expressiveSamples,
].map(
  (sample): Sample => ({
    ...sample,
  }),
);

export function getSections() {
  const categories = Array.from(
    new Set(samples.flatMap((sample) => sample.tags)),
  );

  return categories
    .map((tag) => ({
      tag,
      samples: samples.filter((sample) => sample.tags.includes(tag)),
      slug: slugify(tag, { lower: true }),
    }))
    .sort((a, b) => b.samples.length - a.samples.length);
}

export function getSectionBySlug(slug: string) {
  return getSections().find((section) => section.slug === slug);
}

export function getSampleBySlug(slug: string) {
  return samples.find(
    (sample) => sample.slug === slug || sample.slug === `elevenlabs/${slug}`,
  );
}

export interface Sample {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  content: string;
  author?: {
    name: string;
    url?: string | null;
    avatar?: string | null;
  };
}

export type Section = {
  tag: string;
  samples: Sample[];
};
