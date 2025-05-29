"use client";

import { motion } from "motion/react";
import { HeroTitle } from "./hero-title";
import { VoiceSamples } from "./voice-samples";
import { GlobalSearchInput } from "./global-search-input";
import { ElevenLabs } from "./ui/elevenlabs";

export function Showcase() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 w-full relative mx-auto">
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
            className="mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-center text-lg font-medium mb-2">
              Popular Model Samples
            </h2>
            <p className="text-center text-sm text-[#878787] mb-8">
              Click any sample to listen • View prompts • Vote for your favorites
            </p>
            <VoiceSamples />
          </motion.div>

          <motion.div
            className="text-center py-12 border-t border-[#E5E5E5] dark:border-[#262626]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-[#878787] mb-4">
              Ready to integrate ElevenLabs V3 into your project?
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://elevenlabs.io/api"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                Get API Access
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