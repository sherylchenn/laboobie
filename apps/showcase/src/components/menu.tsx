"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCategoryMeta } from "@/lib/category";
import { cn } from "@/lib/utils";
import type { Section } from "@showcase/data/projects";
import { Filter, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryIcon } from "./ui/category-icon";

export function Menu({ sections }: { sections: Section[] }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-[calc(100vh-3.5rem)] pt-12 px-6 pb-4 flex flex-col md:fixed md:top-14 md:left-[var(--menu-left,theme(spacing.6))]">
      <div className="mb-3">
        <div className="pl-3">
          <span className="text-[15px] font-semibold tracking-tight text-primary">
            Showcase
          </span>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-1">
          {/* Home / All Projects */}
          <Link href="/projects" className="block cursor-pointer">
            <div
              className={cn(
                "w-full inline-flex items-center justify-start gap-2 rounded-full px-3 py-1.5 text-sm cursor-pointer",
                pathname === "/projects"
                  ? "bg-[#2A2A2B]/80 text-white"
                  : "text-foreground/80",
              )}
            >
              <Sparkles
                className={cn(
                  "h-3.5 w-3.5",
                  pathname === "/projects"
                    ? "text-white"
                    : "text-[#666] dark:text-[#999]",
                )}
              />
              Featured
            </div>
          </Link>

          {sections.map((section) => {
            const meta = getCategoryMeta(section.slug);
            const href = `/projects/${section.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                href={href}
                key={section.tag}
                className="block cursor-pointer"
              >
                <div
                  className={cn(
                    "w-full inline-flex items-center justify-start gap-2 rounded-full px-3 py-1.5 text-sm cursor-pointer",
                    isActive
                      ? "bg-[#2A2A2B]/80 text-white"
                      : "text-foreground/80",
                  )}
                >
                  <CategoryIcon
                    meta={meta}
                    className={cn(
                      "h-3.5 w-3.5",
                      isActive ? "text-white" : "text-[#666] dark:text-[#999]",
                    )}
                  />
                  {meta.label}
                  <span className="ml-auto text-[#878787]">
                    {section.projects.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <Separator className="my-4" />
    </aside>
  );
}
