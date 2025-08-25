"use client";

import { WaveBg } from "@/components/wave-bg";

export function GlobalBg() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[120vh] z-0 pointer-events-none overflow-hidden"
      suppressHydrationWarning
    >
      <WaveBg />
      {/* Extended gradient fade to blend with background */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-background via-[hsl(var(--background)/0.7)]_50% to-transparent pointer-events-none" />
    </div>
  );
}
