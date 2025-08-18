"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCategoryMeta } from "@/lib/category";
import Link from "next/link";
import type { Section } from "../../../../packages/data/src/projects";
import { CategoryIcon } from "./ui/category-icon";

export function Menu({ sections }: { sections: Section[] }) {
  return (
    <aside className="w-64 p-4 flex flex-col">
      <ScrollArea className="flex-grow">
        <div className="space-y-1">
          {sections.map((section) => {
            const meta = getCategoryMeta(section.slug);
            return (
              <Link href={`/projects/${section.slug}`} key={section.tag}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <CategoryIcon
                    meta={meta}
                    className="h-3.5 w-3.5 text-[#666] dark:text-[#999]"
                  />
                  {meta.label}
                  <span className="ml-auto text-[#878787]">
                    {section.projects.length}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <Separator className="my-4" />
    </aside>
  );
}
