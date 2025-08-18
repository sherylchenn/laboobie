"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { Project } from "../../../../packages/data/src/projects";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.coverImage ?? "/card.png";
  return (
    <Card className="bg-background p-4 flex flex-col rounded-lg">
      <div className="w-full aspect-video mb-3 overflow-hidden rounded-md bg-[#0A0A0A]">
        <img
          src={cover}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-medium text-base leading-tight truncate">
          {project.title}
        </h3>
        {project.shortDescription && (
          <p className="text-sm text-[#878787] line-clamp-2">
            {project.shortDescription}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          {(project.externalTech ?? project.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-[#666] dark:text-[#999] text-xs"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="pt-2 flex gap-3 text-sm">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white"
            >
              Live demo
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white"
            >
              Source code
            </Link>
          )}
          {project.videoUrl && (
            <Link
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#878787] hover:text-black dark:hover:text-white"
            >
              Video
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
