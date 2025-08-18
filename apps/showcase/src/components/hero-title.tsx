"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroTitle() {
  return (
    <div className="relative isolate mx-auto max-w-3xl text-center mb-14 px-6">
      <div
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm shadow-sm mb-4"
        style={{ opacity: 0, animation: "fadeIn 0.4s ease forwards" }}
        aria-label="Showcase status"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/80 animate-pulse" />
        Built with ElevenLabs
      </div>

      <h1
        className="flex items-center justify-center gap-3 text-[44px] leading-tight md:text-6xl font-waldenburg-hf font-medium tracking-tight mb-4"
        style={{ opacity: 0, animation: "fadeIn 0.6s ease forwards" }}
      >
        <span className="relative w-[200px] h-[50px] md:w-[260px] md:h-[64px]">
          <Image
            src="/logo.svg"
            alt="ElevenLabs Logo"
            fill
            className="object-contain"
          />
        </span>

        {/* Calm, tasteful gradient text (static) */}
        <span className="bg-clip-text text-transparent hero-gradient-text">
          Showcase
        </span>
      </h1>

      <p
        className="text-muted-foreground text-base md:text-lg max-w-[640px] mx-auto mb-6"
        style={{ opacity: 0, animation: "fadeIn 0.8s ease forwards" }}
      >
        Explore a curated gallery of voice and audio experiences built with
        ElevenLabs—from conversational agents and AI dubbing to music creation
        and accessibility tools. Discover what creators and teams are shipping
        today.
      </p>

      <div
        className="flex flex-wrap items-center justify-center gap-2 mb-7"
        style={{ opacity: 0, animation: "fadeIn 1s ease forwards" }}
        aria-label="Categories"
      >
        <Badge variant="secondary" className="rounded-full">
          Conversational AI
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Dubbing
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Music
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Accessibility
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Games
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Creative Tools
        </Badge>
      </div>

      <div
        className="flex items-center justify-center gap-3"
        style={{ opacity: 0, animation: "fadeIn 1.1s ease forwards" }}
      >
        {/* Gradient ring without spinning; gentle hover shift only */}
        <div
          className="-mx-0.5 overflow-hidden rounded-[13px]"
          style={{ height: 44 }}
        >
          <div className="relative p-[3px] rounded-[12px] hero-ring">
            <Button
              size="lg"
              className="relative inline-flex items-center justify-center rounded-[10px] px-6 h-[38px] bg-background text-foreground hover:bg-gray-50 active:bg-gray-100"
              aria-label="Explore projects"
            >
              Explore projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          variant="outline"
          className="rounded-2xl px-6"
          aria-label="Submit your project"
        >
          Submit your project
        </Button>
      </div>

      <style jsx>{`
        /* ===== Animations ===== */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        /* ===== Gradient text (static, tasteful) ===== */
        .hero-gradient-text {
          background-image:
            linear-gradient(90deg,
              rgba(255,255,255,0.95) 0%,
              rgba(163,217,255,1) 20%,
              rgba(222,180,255,1) 45%,
              rgba(255,193,163,1) 65%,
              rgba(255,235,163,1) 85%,
              rgba(255,255,255,0.95) 100%
            );
        }

        /* ===== Gradient ring (static). Slow hover shift, no constant motion ===== */
        .hero-ring {
          background: conic-gradient(
              from 0deg at 50% 50%,
              rgba(102,253,255,0.9),
              rgba(222,75,242,0.9),
              rgba(254,99,1,1),
              rgba(102,253,255,0.9)
            );
          transition: background-position 2.5s ease;
          background-size: 200% 200%;
          background-position: 50% 50%;
        }
        .hero-ring:hover {
          background-position: 60% 40%;
        }
      `}</style>
    </div>
  );
}
