"use client";

import { useDictation } from "@/hooks/use-dictation";
import { cn } from "@/lib/utils";
import { Loader2, Mic, Search } from "lucide-react";
import * as React from "react";
import { DictateButton } from "./dictate-button";
import { Input } from "./input";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

export function SearchBar({
  className,
  placeholder = "Search projects...",
  onSearch,
  defaultValue = "",
  debounceMs = 250,
}: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleDictation = React.useCallback(
    (text: string) => {
      setValue(text);
      onSearch?.(text);
    },
    [onSearch],
  );

  const { isRecording, isUploading, start, stop } = useDictation({
    onTranscribed: handleDictation,
  });

  const showStatusChip = (isRecording || isUploading) && value.length > 0;

  // Debounced search as user types
  React.useEffect(() => {
    const id = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);
    return () => clearTimeout(id);
  }, [value, debounceMs, onSearch]);

  // Sync internal value when external defaultValue changes (e.g., Clear search)
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto w-full max-w-2xl">
        {/* Gradient glow */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-black/[0.06] via-black/[0.12] to-black/[0.06] dark:from-white/[0.06] dark:via-white/[0.12] dark:to-white/[0.06] opacity-70 blur-md" />

        {/* Glass container */}
        <div className="relative rounded-xl border border-black/[0.06] bg-white/70 px-3 py-2 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.30)] transition-colors dark:border-white/[0.09] dark:bg-black/40">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Mic className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                isUploading
                  ? "Processing..."
                  : isRecording
                    ? "Listening..."
                    : placeholder
              }
              aria-busy={isUploading}
              className="h-11 bg-transparent border-0 px-0 focus-visible:ring-0 focus-visible:outline-none shadow-none"
            />
            <DictateButton
              onResult={handleDictation}
              isRecording={isRecording}
              isUploading={isUploading}
              onStart={start}
              onStop={stop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
