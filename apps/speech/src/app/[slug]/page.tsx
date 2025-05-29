import { Menu } from "@/components/menu";
import { SampleCard } from "@/components/sample-card";
import { getSampleBySlug, samples } from "@directories/data/samples";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const sample = getSampleBySlug(slug);

  return {
    title: `${sample?.title} sample by ${sample?.author?.name}`,
    description: sample?.content,
  };
}

export async function generateStaticParams() {
  return samples.map((sample) => ({
    slug: sample.slug,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const sample = getSampleBySlug(slug);

  if (!sample) {
    return <div>Sample not found</div>;
  }

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-16">
        <SampleCard sample={sample} isPage={true} />
      </main>
    </div>
  );
}

export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)
