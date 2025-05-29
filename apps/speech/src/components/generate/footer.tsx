"use client";

import { motion } from "framer-motion";

export function GenerateFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.2 }}
      className="text-center text-sm text-[#878787] fixed bottom-6 left-0 right-0 mx-auto w-fit"
    >
      <a href="https://elevenlabs.io" className="text-primary">
        ElevenLabs
      </a>
    </motion.div>
  );
}
