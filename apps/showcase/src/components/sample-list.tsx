"use client";

import { SampleCard } from "@/components/sample-card";
import { SampleCardSmall } from "@/components/sample-card-small";
import type { Section } from "@showcase/data/samples";
import { useQueryState } from "nuqs";
import { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 6;

export function SampleList({
  sections,
  isPage = false,
}: {
  sections: Section[];
  isPage?: boolean;
}) {
  const [search, setSearch] = useQueryState("q");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // Reset visible items when search changes
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [search]);

  const filteredSections = sections
    .map((section) => ({
      ...section,
      samples: section.samples.filter(
        (sample) =>
          !search ||
          sample.title.toLowerCase().includes(search.toLowerCase()) ||
          sample.content.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((section) => section.samples.length > 0);

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && visibleItems < filteredSections.length) {
      setVisibleItems((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredSections.length),
      );
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  let totalItemsCount = 0;

  if (!filteredSections.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex-col gap-4 flex items-center">
          <p className="text-[#878787] text-sm">No samples found</p>
          <Button
            variant="outline"
            className="mt-2 border-border rounded-full"
            onClick={() => setSearch(null)}
          >
            Clear search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {filteredSections.slice(0, visibleItems).map((section, idx) => (
        <section key={section.tag} id={section.tag}>
          <h3 className="text-lg font-regular mb-4">{section.tag}</h3>
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2 xl:grid-cols-3">
            {section.samples.map((sample, idx2) => {
              totalItemsCount++;
              return (
                <Fragment key={`${idx}-${idx2.toString()}`}>
                  <SampleCard
                    key={`${idx}-${idx2.toString()}`}
                    sample={sample}
                    isPage={isPage}
                  />
                </Fragment>
              );
            })}
          </div>
        </section>
      ))}

      {visibleItems < filteredSections.length && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() =>
              setVisibleItems((prev) =>
                Math.min(prev + ITEMS_PER_PAGE, filteredSections.length),
              )
            }
            className="px-4 py-2 text-sm text-[#878787]"
          >
            Loading more...
          </button>
        </div>
      )}
    </>
  );
}
