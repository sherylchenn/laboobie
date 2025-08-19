"use client";

import { WaveBg } from "@/components/wave-bg";

export function GlobalBg() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      suppressHydrationWarning
    >
      <WaveBg />
    </div>
  );
}
