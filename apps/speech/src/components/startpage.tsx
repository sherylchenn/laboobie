"use client";

import type { Section } from "@directories/data/samples";
import { motion } from "motion/react";
import { GenerateInline } from "./generate/inline";
import { HeroTitle } from "./hero-title";
import { SampleList } from "./sample-list";
import { ElevenLabs } from "./ui/elevenlabs";

export function Startpage({
  sections,
  elevenLabsSamplesSections,
}: {
  sections: Section[];
  elevenLabsSamplesSections: Section[];
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

          <div className="w-full mb-14">
            <GenerateInline />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="transition-all duration-1000">
                <motion.div
                  className="mb-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                >
                  <h2 className="text-left text-lg font-medium mb-2">
                    Trending V3 Samples
                  </h2>
                  <p className="text-left text-sm text-[#878787] mb-8">
                    Click any sample to listen, view prompts & vote for your
                    favorites
                  </p>
                </motion.div>
              </div>
            </div>
            <SampleList sections={sections} />
          </motion.div>
          <motion.div
            className="text-center py-12 border-[#E5E5E5] dark:border-[#262626]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-[#878787] mb-4">
              Integrate ElevenLabs v3 into your projects
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
