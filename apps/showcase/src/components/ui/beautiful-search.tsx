"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import * as React from "react";
import { Input } from "./input";

interface BeautifulSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  defaultValue?: string;
}

export function BeautifulSearch({
  className,
  placeholder = "Search projects...",
  onSearch,
  defaultValue = "",
}: BeautifulSearchProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative mx-auto w-full max-w-2xl">
        {/* Gradient glow */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-black/[0.06] via-black/[0.12] to-black/[0.06] dark:from-white/[0.06] dark:via-white/[0.12] dark:to-white/[0.06] opacity-70 blur-md" />

        {/* Glass container */}
        <div className="relative rounded-xl border border-black/[0.06] bg-white/70 px-3 py-2 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.30)] transition-colors dark:border-white/[0.09] dark:bg-black/40">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="h-11 bg-transparent border-0 px-0 focus-visible:ring-0 focus-visible:outline-none shadow-none"
            />
            <button
              type="submit"
              className="ml-auto inline-flex h-8 items-center rounded-md border border-black/[0.08] px-2 text-xs text-foreground/80 transition-colors hover:bg-black/[0.03] dark:border-white/[0.12] dark:hover:bg-white/[0.06]"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
