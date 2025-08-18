"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import slugify from "slugify";
import type { Project } from "../../../../packages/data/src/projects";

export function SearchList({ data }: { data: Project[] }) {
  const [search] = useQueryState("q");

  const filteredData = data.filter((item) => {
    const searchTerm = search?.toLowerCase() ?? "";
    return (
      item.title.toLowerCase().includes(searchTerm) ||
      (item.description?.toLowerCase() ?? "").includes(searchTerm)
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8">
      {filteredData.map((item) => (
        <div key={item.slug}>
          <Link
            href={`/projects/${slugify(item.slug, { lower: true })}`}
            className="flex h-full items-center p-4 transition-colors border border-border hover:bg-accent"
          >
            <div className="flex items-start gap-4 w-full">
              <div className="flex flex-col flex-1">
                <h3 className="font-medium text-primary">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-[#878787]">{item.description}</p>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
