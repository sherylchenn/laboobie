"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Project } from "@showcase/data/projects";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function VisionDitheredImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* base image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${className ?? ""} w-full h-full object-cover select-none`}
        loading="lazy"
        style={{ filter: "saturate(0.85) contrast(1.06) brightness(1.02)" }}
      />

      {/* tiny pixel-dot dither, matched to the smoky wave grain */}
      {/* layer 1: soft-light white micro dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "soft-light",
          opacity: 0.5,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 0.45px, transparent 0.46px), radial-gradient(circle, rgba(255,255,255,0.35) 0.35px, transparent 0.36px)",
          backgroundSize: "2px 2px, 3px 3px",
          backgroundPosition: "0 0, 1px 1px",
        }}
      />
      {/* layer 2: multiply dark micro dots to add subtle depth in highlights */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0.2,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.28) 0.5px, transparent 0.6px)",
          backgroundSize: "3px 3px",
          backgroundPosition: "0.5px 0.5px",
        }}
      />

      {/* color grading overlay to unify palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "color",
          opacity: 0.12,
          background:
            "linear-gradient(180deg, rgba(168,197,255,0.9) 0%, rgba(255,209,177,0.9) 100%)",
        }}
      />
      {/* subtle contrast shaping */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "soft-light",
          opacity: 0.18,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* gentle top sheen to tie into the Vision Pro glass aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 35%)",
        }}
      />

      {/* stronger radial vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 85%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(160% 140% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 95%)",
        }}
      />
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.image ?? "/card.png";
  return (
    <Card className="bg-background p-4 flex flex-col rounded-lg relative group overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={project.title}
      />
      <div className="w-full aspect-video mb-3 overflow-hidden rounded-md bg-[#0A0A0A]">
        <VisionDitheredImage src={cover} alt={project.title} />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-medium text-base leading-tight truncate">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-[#878787] line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {(project.technologies ?? project.tags ?? [])
              .slice(0, 3)
              .map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-[#666] dark:text-[#999] text-xs relative z-10"
                >
                  {t}
                </span>
              ))}
          </div>
          {project.authors && project.authors.length > 0 && (
            <TooltipProvider>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {project.authors.slice(0, 4).map((a, i) => {
                    const initials = a.name
                      .split(" ")
                      .map((p) => p[0] ?? "")
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    const avatar = (
                      <Tooltip key={`${a.name}-${i.toString()}`}>
                        <TooltipTrigger asChild>
                          <div className="relative z-10 rounded-full overflow-hidden">
                            <Avatar className="h-7 w-7">
                              {a.avatar ? (
                                <AvatarImage src={a.avatar} alt={a.name} />
                              ) : (
                                <AvatarFallback>{initials}</AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{a.name}</TooltipContent>
                      </Tooltip>
                    );

                    return a.url ? (
                      <a
                        key={`${a.name}-${a.url}-${i.toString()}`}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={a.name}
                        className="focus:outline-none"
                      >
                        {avatar}
                      </a>
                    ) : (
                      <div key={`${a.name}-${i.toString()}`}>{avatar}</div>
                    );
                  })}
                </div>
                {project.authors.length > 4 && (
                  <span className="ml-2 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm">
                    +{project.authors.length - 4}
                  </span>
                )}
              </div>
            </TooltipProvider>
          )}
        </div>
        <div className="pt-2 flex gap-3 text-sm">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white relative z-10"
            >
              Live demo
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white relative z-10"
            >
              Source code
            </Link>
          )}
          {project.videoUrl && (
            <Link
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white relative z-10"
            >
              Video
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
