"use client";

import { getCategoryMeta } from "@/lib/category";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { CategoryIcon } from "./category-icon";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export interface ShowcaseTab {
  id: string;
  label?: string;
}

const defaultTabIds = [
  "featured",
  "conversational-ai",
  "music",
  "text-to-speech",
  "voice-cloning",
  "speech-to-text",
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
  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const handleChange = (next: string) => {
    onValueChange?.(next);
    onTabChange?.(next);
  };

  // Auto-scroll to center the selected tab on mobile
  useEffect(() => {
    if (
      activeTabRef.current &&
      tabsListRef.current &&
      window.innerWidth < 768
    ) {
      const container = tabsListRef.current;
      const activeTab = activeTabRef.current;

      const containerWidth = container.offsetWidth;
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [value]);

  return (
    <Tabs
      defaultValue={defaultTab}
      value={value}
      onValueChange={handleChange}
      className={cn("w-full", className)}
    >
      <div
        ref={tabsListRef}
        className="w-full overflow-x-auto scrollbar-hide md:overflow-visible"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <TabsList
          className={cn(
            "inline-flex gap-1 sm:gap-2 bg-transparent p-0 rounded-none h-auto mb-2 animate-in fade-in-0 slide-in-from-bottom-1",
            "min-w-max",
            "md:w-full md:justify-center md:flex-wrap",
          )}
        >
          {tabs.map((tab) => {
            const meta = getCategoryMeta(tab.id);
            const isActive = (value || defaultTab) === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                value={tab.id}
                className={cn(
                  "gap-2 cursor-pointer flex-shrink-0 whitespace-nowrap text-white/60",
                )}
              >
                <CategoryIcon meta={meta} className="h-4 w-4 opacity-80" />
                <span>{tab.label ?? meta.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </Tabs>
  );
}

export { defaultTabs };
