"use client";

import { useDictation } from "@/hooks/use-dictation";
import { cn } from "@/lib/utils";
import { Mic, Search } from "lucide-react";
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
        {/* Flat, opaque container */}
        <div className="relative rounded-lg border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#0C0C0C] px-3 py-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Mic className="h-4 w-4 text-[#878787]" />
            ) : (
              <Search className="h-4 w-4 text-[#878787]" />
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
              className="h-10 bg-transparent border-0 px-0 focus-visible:ring-0 focus-visible:outline-none shadow-none"
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
