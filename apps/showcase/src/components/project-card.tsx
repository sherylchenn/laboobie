"use client";

import { Card } from "@/components/ui/card";
import type { Project } from "@showcase/data/projects";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.image ?? "/card.png";
  return (
    <Card className="bg-background p-4 flex flex-col rounded-lg relative group">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={project.title}
      />
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
        {project.description && (
          <p className="text-sm text-[#878787] line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          {(project.technologies ?? project.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-[#666] dark:text-[#999] text-xs relative z-10"
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
