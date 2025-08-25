"use client";

import type { Project } from "@showcase/data/projects";
import Link from "next/link";

export function GenerateList({ data }: { data: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {data.map((d) => {
        return (
          <Link key={d.slug} href={`/${d.slug}`}>
            {d.title}
          </Link>
        );
      })}
    </div>
  );
}
