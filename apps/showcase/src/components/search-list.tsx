"use client";

import type { Project } from "@showcase/data/projects";
import Link from "next/link";
import { ShareButton } from "./share-button";

export function SearchList({ results }: { results: Project[] }) {
  if (!results.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((item) => (
        <div key={item.slug} className="border border-border p-3 rounded-md">
          <div className="flex justify-between items-start">
            <Link href={`/${item.slug}`} className="font-medium">
              {item.title}
            </Link>
            <ShareButton slug={item.slug} small />
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
