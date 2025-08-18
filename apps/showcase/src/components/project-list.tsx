"use client";

import { useQueryState } from "nuqs";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { Section } from "../../../../packages/data/src/projects";
import { ProjectCard } from "./project-card";
import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 6;

export function ProjectList({ sections }: { sections: Section[] }) {
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
            (p.shortDescription ?? "").toLowerCase().includes(q) ||
            (p.longDescription ?? "").toLowerCase().includes(q) ||
            (p.externalTech ?? []).some((t) => t.toLowerCase().includes(q)) ||
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
      <div className="flex justify-center items-center h-full">
        <div className="flex-col gap-4 flex items-center">
          <p className="text-[#878787] text-sm">No projects found</p>
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
            {section.projects.map((project, idx2) => (
              <Fragment key={`${idx}-${idx2.toString()}`}>
                <ProjectCard project={project} />
              </Fragment>
            ))}
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
