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

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.image ?? "/card.png";
  return (
    <Card className="bg-background p-4 flex flex-col rounded-lg relative group overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={project.title}
      >
        <span className="sr-only">View {project.title} project</span>
      </Link>
      <div className="w-full aspect-video mb-3 overflow-hidden rounded-md bg-[#0A0A0A]">
        <DitheredImage src={cover} alt={project.title} />
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
