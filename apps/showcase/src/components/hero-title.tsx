"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroTitle() {
  return (
    <div className="relative isolate mx-auto max-w-3xl text-center mb-14 px-6">
      <div className="pointer-events-none absolute -inset-x-10 -top-24 -bottom-16 -z-10 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-3xl" />
      <div
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm shadow-sm mb-4"
        style={{ opacity: 0, animation: "fadeIn 0.4s ease forwards" }}
        aria-label="Showcase status"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400/80 animate-pulse" />
        Built with ElevenLabs
      </div>

      <p
        className="text-muted-foreground text-base md:text-lg max-w-[640px] mx-auto mb-6"
        style={{ opacity: 0, animation: "fadeIn 0.8s ease forwards" }}
      >
        Explore a curated gallery of voice and audio experiences built with
        ElevenLabs. From conversational agents to music creation and
        accessibility tools. Discover what creators and teams are shipping
        today.
      </p>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
