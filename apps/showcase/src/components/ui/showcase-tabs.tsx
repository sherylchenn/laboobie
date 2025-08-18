"use client";

import { getCategoryMeta } from "@/lib/category";
import { cn } from "@/lib/utils";
import type * as React from "react";
import { CategoryIcon } from "./category-icon";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export interface ShowcaseTab {
  id: string;
  label?: string;
}

const defaultTabIds = [
  "featured",
  "conversational-ai",
  "voice-cloning",
  "audiobooks",
  "video",
  "music",
  "multilingual",
  "api",
] as const;

const defaultTabs: ShowcaseTab[] = defaultTabIds.map((id) => ({ id }));

interface ShowcaseTabsProps {
  tabs?: ShowcaseTab[];
  defaultTab?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function ShowcaseTabs({
  tabs = defaultTabs,
  defaultTab = "featured",
  value,
  onValueChange,
  onTabChange,
  className,
}: ShowcaseTabsProps) {
  const handleChange = (next: string) => {
    onValueChange?.(next);
    onTabChange?.(next);
  };

  return (
    <Tabs
      defaultValue={defaultTab}
      value={value}
      onValueChange={handleChange}
      className={cn("w-full", className)}
    >
      <TabsList
        className={cn(
          "flex flex-wrap justify-start gap-1 sm:gap-2 bg-transparent p-0 rounded-none h-auto mb-2 animate-in fade-in-0 slide-in-from-bottom-1",
        )}
      >
        {tabs.map((tab) => {
          const meta = getCategoryMeta(tab.id);
          return (
            <TabsTrigger key={tab.id} value={tab.id} className={cn("gap-2")}>
              <CategoryIcon
                meta={meta}
                className="h-4 w-4 text-[#666] dark:text-[#999]"
              />
              <span>{tab.label ?? meta.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export { defaultTabs };
