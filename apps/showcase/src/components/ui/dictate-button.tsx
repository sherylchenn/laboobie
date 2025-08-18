"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDictation } from "@/hooks/use-dictation";
import { Mic, Square } from "lucide-react";

export function DictateButton({
  onResult,
  endpoint = "/api/transcribe",
  isRecording: extIsRecording,
  isUploading: extIsUploading,
  onStart: extStart,
  onStop: extStop,
}: {
  onResult: (text: string) => void;
  endpoint?: string;
  isRecording?: boolean;
  isUploading?: boolean;
  onStart?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
}) {
  const { isRecording, isUploading, start, stop } = useDictation({
    endpoint,
    onTranscribed: onResult,
  });

  const usingExternal =
    typeof extIsRecording === "boolean" &&
    typeof extIsUploading === "boolean" &&
    typeof extStart === "function" &&
    typeof extStop === "function";

  const effectiveIsRecording = usingExternal ? extIsRecording! : isRecording;
  const effectiveIsUploading = usingExternal ? extIsUploading! : isUploading;
  const handleClick = () => {
    if (usingExternal) {
      return effectiveIsRecording ? extStop!() : extStart!();
    }
    return isRecording ? stop() : start();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/[0.08] text-foreground/80 transition-colors hover:bg-black/[0.03] dark:border-white/[0.12] dark:hover:bg-white/[0.06]"
            aria-label={
              effectiveIsRecording ? "Stop dictation" : "Start dictation"
            }
            title={effectiveIsRecording ? "Stop dictation" : "Start dictation"}
            disabled={effectiveIsUploading}
          >
            {effectiveIsRecording ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            Transcribe with {""}
            <a
              href="https://elevenlabs.io/speech-to-text"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2"
            >
              Scribe
            </a>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
