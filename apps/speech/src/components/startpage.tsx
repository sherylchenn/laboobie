"use client";

import type { Section } from "@directories/data/samples";
import { motion } from "motion/react";
import { GlobalSearchInput } from "./global-search-input";
import { HeroTitle } from "./hero-title";
import { SampleList } from "./sample-list";
import { ElevenLabs } from "./ui/elevenlabs";

export function Startpage({
  sections,
}: {
  sections: Section[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 w-full relative mx-auto h-screen">
        <div className="transition-all duration-1000">
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

          <div className="max-w-[620px] mx-auto w-full mb-14">
            <GlobalSearchInput />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <SampleList sections={sections} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
