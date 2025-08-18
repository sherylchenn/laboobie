"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandEmpty, CommandInput } from "./ui/command";
import { CommandDialog, CommandItem, CommandList } from "./ui/command";

interface Sample {
  title: string;
  slug: string; // Added slug property for navigation
  // Add other properties that a sample might have
}

const getSamples = async () => {
  const samples = await import("@directories/data/samples").then(
    (mod) => mod.samples,
  );
  // Filter out duplicates based on title
  const uniqueSamples = Array.from(
    new Map(samples.map((sample) => [sample.title, sample])).values(),
  );
  return uniqueSamples;
};

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load rules when component mounts
    getSamples().then((loadedSamples) => setSamples(loadedSamples));
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a sample..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {samples.map((sample, index) => (
          <CommandItem
            key={sample.title}
            onSelect={() => {
              router.push(`/${sample.slug}`);
              setOpen(false);
            }}
          >
            {sample.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
