"use client";

import { DitheredImage } from "@/components/dithered-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Project } from "@showcase/data/projects";
import Link from "next/link";
import React from "react";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.image ?? "/card.png";

  const actions = [
    project.demoUrl && { label: "Live demo", href: project.demoUrl },
    project.repoUrl && { label: "Source Code", href: project.repoUrl },
    project.videoUrl && { label: "Video", href: project.videoUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  const cols =
    actions.length === 3
      ? "grid-cols-3"
      : actions.length === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  return (
    <Card className="relative isolate group overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] p-5 pb-0 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-colors hover:border-white/15">
      {/* Make the whole card clickable to the project page */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={project.title}
      >
        <span className="sr-only">View {project.title} project</span>
      </Link>

      {/* Cover */}
      <div className="w-full aspect-video mb-4 overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/5">
        <DitheredImage src={cover} alt={project.title} />
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h3 className="truncate text-[22px] font-medium leading-snug tracking-[-0.01em] text-white">
          {project.title}
        </h3>

        {project.description && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[#878787]">
            {project.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {(project.technologies ?? project.tags ?? [])
              .slice(0, 3)
              .map((t) => (
                <span
                  key={t}
                  className="relative z-10 rounded-full border border-white/10 bg-[#111111] px-2.5 py-1 text-[11px] leading-none text-[#B3B3B3]"
                >
                  {t}
                </span>
              ))}
          </div>

          {/* Authors */}
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
                          <div className="relative z-10 overflow-hidden rounded-full ring-1 ring-white/10">
                            <Avatar className="h-7 w-7">
                              {a.avatar ? (
                                <AvatarImage src={a.avatar} alt={a.name} />
                              ) : (
                                <AvatarFallback className="text-[10px]">
                                  {initials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-1 text-xs">
                          {a.name}
                        </TooltipContent>
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
                  <span className="ml-2 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] leading-none text-white/80 backdrop-blur-sm">
                    +{project.authors.length - 4}
                  </span>
                )}
              </div>
            </TooltipProvider>
          )}
        </div>

        {/* Bottom segmented actions */}
        {actions.length > 0 && (
          <div className="relative z-10 mt-4 -mx-5 border-t border-white/10 text-sm text-[#878787]">
            <div className={`grid ${cols}`}>
              {actions.map((a, idx) => (
                <Link
                  key={`${a.label}-${idx}`}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center py-3 transition-colors hover:text-white ${
                    idx > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
