import { Startpage } from "@/components/startpage";
import { getFeaturedJobs, getFeaturedMCPs } from "@/data/queries";
import { getPopularRules } from "@directories/data/popular";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursor Directory - Cursor Rules & MCP Servers",
  description:
    "Enhance your Cursor with custom rules, find MCP servers, and join a community of Cursor enthusiasts.",
};

// Add force-static and revalidate configuration
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export default async function Page() {
  const popularRules = await getPopularRules();
  const { data: featuredJobs } = await getFeaturedJobs({
    onlyPremium: true,
  });

  const { data: featuredMCPs } = await getFeaturedMCPs({
    onlyPremium: true,
  });

  return (
    <div className="flex justify-center min-h-screen w-full md:px-0 px-6 mt-[10%]">
      <div className="w-full max-w-6xl">
        <Startpage
          sections={popularRules}
          jobs={featuredJobs}
          mcps={featuredMCPs}
        />
      </div>
    </div>
  );
}
