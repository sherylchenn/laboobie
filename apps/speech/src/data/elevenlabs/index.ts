import { readFileSync } from "node:fs";
import { join } from "node:path";

const readMdFile = (filename: string) => {
  try {
    const filePath = join(process.cwd(), "src/data/elevenlabs", filename);
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    return "";
  }
};

export const elevenLabsSamples = [
  {
    tags: ["UI", "Components", "Shadcn"],
    title: "Shadcn",
    description: "Shadcn is a library of components for React.",
    slug: "shadcn-ui",
    content: readMdFile("./shadcn.md"),
    author: {
      name: "shadcn",
      url: "https://x.com/shadcn",
      avatar:
        "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    },
  },
];

export const elevenLabsSamplesSections = [
  {
    tag: "ElevenLabs",
    samples: elevenLabsSamples.filter(
      (sample) =>
        sample.content &&
        sample.content.trim() !== "# Content coming soon" &&
        sample.content.trim() !== ""
    ),
  },
];

export function getElevenLabsSampleBySlug(slug: string) {
  return elevenLabsSamples.find(
    (sample) => sample.slug === `elevenlabs/${slug}`
  );
}
