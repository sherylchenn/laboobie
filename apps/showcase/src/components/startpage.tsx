"use client";

import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import * as React from "react";
import type { Section } from "../../../../packages/data/src/projects";
import { HeroTitle } from "./hero-title";
import { ProjectList } from "./project-list";
import { ElevenLabs } from "./ui/elevenlabs";
import { SearchBar } from "./ui/search-bar";
import { ShowcaseTabs } from "./ui/showcase-tabs";

export function Startpage({
  sections,
}: {
  sections: Section[];
}) {
  const [activeTab, setActiveTab] = React.useState("featured");
  const [search, setSearch] = useQueryState("q");
  const filteredSections = React.useMemo(() => {
    if (activeTab === "featured") {
      const all = sections.flatMap((s) => s.projects);
      const featured = all
        .filter((p) => p.isFeatured)
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
      const toShow =
        featured.length > 0
          ? featured
          : all.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
      return [
        {
          tag: featured.length > 0 ? "Featured" : "Latest",
          slug: featured.length > 0 ? "featured" : "latest",
          projects: toShow,
        },
      ];
    }
    const keywordMap: Record<string, string[]> = {
      "conversational-ai": ["conversation", "chat", "assistant"],
      "voice-cloning": ["voice", "clone", "cloning"],
      video: ["video", "visual"],
      music: ["music", "song", "audio"],
      multilingual: [
        "multilingual",
        "language",
        "translate",
        "translation",
        "multi",
      ],
      api: ["api", "sdk", "developer"],
    };
    const keywords = keywordMap[activeTab] ?? [];
    return sections.filter((section) => {
      const tag = section.tag.toLowerCase();
      return keywords.some((k) => tag.includes(k));
    });
  }, [sections, activeTab]);
  return (
    <div>
      <div className="flex flex-col gap-4 w-full relative mx-auto h-screen">
        <div className="transition-all duration-1000 relative z-10">
          <div
            className="flex justify-center items-center mb-8"
            style={{
              opacity: 0,
              animation: "fadeIn 1s ease forwards",
            }}
          >
            <ElevenLabs />
          </div>

          <HeroTitle />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="transition-all duration-1000">
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                >
                  <SearchBar
                    onSearch={(val) => setSearch(val || null)}
                    defaultValue={search ?? ""}
                  />
                </motion.div>
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                >
                  <ShowcaseTabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                  />
                </motion.div>
              </div>
            </div>
            <ProjectList
              sections={filteredSections}
              onReset={() => {
                setSearch(null);
                setActiveTab("featured");
              }}
            />
          </motion.div>
          <motion.div
            className="text-center py-12 border-[#E5E5E5] dark:border-[#262626]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-[#878787] mb-4">
              Integrate ElevenLabs into your projects
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://elevenlabs.io/developers"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                Use the API
              </a>
              <a
                href="https://elevenlabs.io/docs"
                className="px-4 py-2 border border-[#E5E5E5] dark:border-[#262626] rounded-md hover:border-[#878787] dark:hover:border-[#404040] transition-colors text-sm"
              >
                View Documentation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
