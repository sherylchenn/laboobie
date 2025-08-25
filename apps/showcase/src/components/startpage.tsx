"use client";

import type { Section } from "@showcase/data/projects";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { HeroTitle } from "./hero-title";
import { ProjectList } from "./project-list";
import { ElevenLabsCreative } from "./ui/elevenlabs-creative";
import { SearchBar } from "./ui/search-bar";
import { ShowcaseTabs } from "./ui/showcase-tabs";
import { WaveBg } from "./wave-bg";

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
      <div className="flex flex-col gap-4 w-full relative mx-auto h-screen px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="transition-all duration-1000 relative z-10">
          <motion.div
            className="flex justify-center items-center mb-8 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ElevenLabsCreative className="relative z-10" size={100} />
          </motion.div>

          <HeroTitle />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="transition-all duration-1000">
                <div className="mb-8">
                  <SearchBar
                    onSearch={(val) => setSearch(val || null)}
                    defaultValue={search ?? ""}
                  />
                </div>
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
        </div>
      </div>
    </div>
  );
}
