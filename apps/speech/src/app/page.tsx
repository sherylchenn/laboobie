import { Showcase } from "@/components/showcase";
import { Startpage } from "@/components/startpage";
import { getPopularRules } from "@directories/data/popular";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ElevenLabs V3 - Advanced Text-to-Speech AI Model",
  description:
    "Experience the most natural and expressive AI voices. Listen to demos of ElevenLabs V3 across multiple languages, emotions, and use cases.",
};

// Add force-static and revalidate configuration
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export default async function Page() {
  const popularRules = await getPopularRules();

  return (
    <div className="flex justify-center min-h-screen w-full md:px-0 px-6 mt-[10%]">
      <div className="w-full max-w-6xl">
        <Startpage sections={popularRules} />
        <Showcase />
      </div>
    </div>
  );
}
