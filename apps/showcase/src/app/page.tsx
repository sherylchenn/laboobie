import { Startpage } from "@/components/startpage";
import { getPopularProjects } from "@showcase/data/popular";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ElevenLabs Showcase | Best projects and demos",
  description:
    "Explore curated voice and audio experiences built with ElevenLabs: conversational agents, voice cloning, music, accessibility tools, and more.",
  alternates: {
    canonical: "/",
  },
};

// Add force-static and revalidate configuration
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export default async function Page() {
  const popularProjects = await getPopularProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ElevenLabs Showcase",
    url: "https://showcase.elevenlabs.io/",
    description:
      "Explore curated voice and audio experiences built with ElevenLabs: conversational agents, voice cloning, music, accessibility tools, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://showcase.elevenlabs.io/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex justify-center min-h-screen w-full md:px-0 px-6 mt-[10%]">
      <div className="w-full max-w-6xl">
        <h1 className="sr-only">ElevenLabs Showcase</h1>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Startpage sections={popularProjects} />
      </div>
    </div>
  );
}
