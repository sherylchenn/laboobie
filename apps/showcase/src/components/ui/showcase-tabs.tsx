"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Globe,
  MessageSquare,
  Mic,
  Music,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import type * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export interface ShowcaseTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const defaultTabs: ShowcaseTab[] = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "conversational-ai", label: "Conversational AI", icon: MessageSquare },
  { id: "voice-cloning", label: "Voice Cloning", icon: Mic },
  { id: "audiobooks", label: "Audiobooks", icon: BookOpen },
  { id: "video", label: "Video", icon: Video },
  { id: "music", label: "Music", icon: Music },
  { id: "multilingual", label: "Multilingual", icon: Globe },
  { id: "api", label: "API", icon: Zap },
];

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
          "flex flex-wrap justify-start gap-1 sm:gap-2 bg-transparent p-0 rounded-none h-auto mb-2",
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.id} value={tab.id} className={cn("gap-2")}>
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export { defaultTabs };
