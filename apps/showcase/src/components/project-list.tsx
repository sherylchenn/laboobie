"use client";

import { getCategoryMeta } from "@/lib/category";
import { useQueryState } from "nuqs";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { Section } from "../../../../packages/data/src/projects";
import { ProjectCard } from "./project-card";
import { Button } from "./ui/button";
import { CategoryIcon } from "./ui/category-icon";

const ITEMS_PER_PAGE = 6;

export function ProjectList({
  sections,
  onReset,
}: {
  sections: Section[];
  onReset?: () => void;
}) {
  const [search, setSearch] = useQueryState("q");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [search]);

  const filteredSections = useMemo(() => {
    return sections
      .map((section) => ({
        ...section,
        projects: section.projects.filter((p) => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            (p.description ?? "").toLowerCase().includes(q) ||
            (p.technologies ?? []).some((t) => t.toLowerCase().includes(q)) ||
            (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((section) => section.projects.length > 0);
  }, [sections, search]);

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

  if (!filteredSections.length) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-[#E5E5E5] dark:border-[#262626] bg-white/60 dark:bg-black/30 text-center min-h-[50vh] p-8">
            <img
              src="/icons/not-found.svg"
              alt="No projects found"
              className="h-16 w-16 mb-3"
            />
            <h3 className="text-base font-semibold">No projects found</h3>
            <p className="text-sm text-[#878787] mt-1">
              We couldn't find any projects for this search and filter
            </p>
            <Button
              variant="outline"
              className="mt-4 border-border rounded-full"
              onClick={() => (onReset ? onReset() : setSearch(null))}
            >
              Clear search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {filteredSections.slice(0, visibleItems).map((section, idx) => {
        const meta = getCategoryMeta(section.slug);
        return (
          <section key={section.tag} id={section.tag}>
            <h3 className="text-lg font-regular mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#2A2A2B]/80 text-white">
                <CategoryIcon meta={meta} className="h-3.5 w-3.5" />
              </span>
              {meta.label}
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2 xl:grid-cols-3">
              {section.projects.map((project, idx2) => (
                <Fragment key={`${idx}-${idx2.toString()}`}>
                  <ProjectCard project={project} />
                </Fragment>
              ))}
            </div>
          </section>
        );
      })}

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
