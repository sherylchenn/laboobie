"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Sample } from "@showcase/data/samples";
import { observer } from "mobx-react";
import Link from "next/link";
import {
  type SimpleAudioInfo,
  closePlayer,
  currentAudio,
  isPlaying,
  loadAndPlay,
} from "./audio-player/simple-audio-player";
import { CopyButton } from "./copy-button";
import { SaveSampleButton } from "./save-sample-button";
import { ShareButton } from "./share-button";

export const SampleCard = observer(
  ({
    sample,
    isPage,
  }: {
    sample: Sample;
    isPage?: boolean;
  }) => {
    const isCurrentlyPlaying =
      isPlaying.get() && currentAudio.get()?.slug === sample.slug;

    const handlePlay = () => {
      if (isCurrentlyPlaying) {
        closePlayer();
        return;
      }

      const audioInfo: SimpleAudioInfo = {
        title: sample.title,
        audioUrl: `/samples/${sample.slug}.mp3`,
        slug: sample.slug,
        description: sample.description,
      };

      loadAndPlay(audioInfo);
    };

    return (
      <Card
        className={cn(
          "bg-background p-4 flex flex-col max-h-[calc(100vh-8rem)] rounded-lg",
          isPage && "aspect-square",
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-base mb-1">{sample.title}</h3>
            <p className="text-sm text-[#878787] h-10 line-clamp-2 overflow-hidden">
              {sample.description}
            </p>
            {!isPage && (
              <Link href={`/${sample.slug}`}>
                <Button
                  variant="link"
                  className="text-sm text-[#878787] !p-0 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span>View prompt</span>
                </Button>
              </Link>
            )}
          </div>
          <Button
            onClick={handlePlay}
            size="icon"
            className="ml-3 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform flex-shrink-0"
            aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
          >
            {isCurrentlyPlaying ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </Button>
        </div>
        {isPage && (
          <CardContent
            className={cn(
              "bg-card h-full mb-2 font-mono p-4 pr-1 text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow",
              isPage && "opacity-100",
            )}
          >
            <div className="group-hover:flex hidden right-4 bottom-4 absolute z-10 space-x-2">
              <ShareButton slug={sample.slug} />
              <CopyButton content={sample.content} slug={sample.slug} />
              <SaveSampleButton content={sample.content} slug={sample.slug} />
            </div>

            <div className="h-full overflow-y-auto">
              <code className="text-sm block pr-3">{sample.content}</code>
            </div>
          </CardContent>
        )}
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-[#666] dark:text-[#999]">
                {sample.tags[0]}
              </span>
              <span className="text-[#878787]">1</span>
            </div>

            <div className="flex items-center gap-2">
              {sample.author && (
                <span className="text-[#878787]">by {sample.author.name}</span>
              )}
              <button
                type="button"
                onClick={(e) => {}}
                className="flex items-center gap-1 px-2 py-1 rounded transition-all bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#666] dark:text-[#999] hover:bg-[#E5E5E5] dark:hover:bg-[#262626]"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>1</span>
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  },
);
