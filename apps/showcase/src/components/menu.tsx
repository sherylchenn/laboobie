"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCategoryMeta } from "@/lib/category";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Section } from "../../../../packages/data/src/projects";
import { CategoryIcon } from "./ui/category-icon";

export function Menu({ sections }: { sections: Section[] }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 p-4 flex flex-col">
      <ScrollArea className="flex-grow">
        <div className="space-y-1">
          {sections.map((section) => {
            const meta = getCategoryMeta(section.slug);
            const href = `/projects/${section.slug}`;
            const isActive = pathname === href;
            return (
              <Link href={href} key={section.tag}>
                <Button
                  variant="ghost"
                  className={
                    `w-full justify-start gap-2 transition-colors ` +
                    (isActive
                      ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                      : "text-foreground/80 hover:text-white/90 hover:bg-transparent")
                  }
                >
                  <CategoryIcon
                    meta={meta}
                    className={
                      `h-3.5 w-3.5 ` +
                      (isActive ? "text-white" : "text-[#666] dark:text-[#999]")
                    }
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
