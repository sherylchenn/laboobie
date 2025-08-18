import { Menu } from "@/components/menu";
import { SampleList } from "@/components/sample-list";
import { Tabs } from "@/components/tabs";
import { getPopularSamples } from "@directories/data/popular";

export const metadata = {
  title: "Popular samples",
  description: "Popular samples from v3.",
};

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export default async function Page() {
  const popularSamples = await getPopularSamples();

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />
        <SampleList sections={popularSamples} isPage />
      </main>
    </div>
  );
}
