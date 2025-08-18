"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandEmpty, CommandInput } from "./ui/command";
import { CommandDialog, CommandItem, CommandList } from "./ui/command";

interface ProjectItem {
  title: string;
  slug: string;
}

const getProjects = async (): Promise<ProjectItem[]> => {
  try {
    const res = await fetch("/api/popular", { cache: "force-cache" });
    if (!res.ok) return [];
    const json = await res.json();
    const list: any[] = Array.isArray(json?.data) ? json.data : [];
    const unique = Array.from(new Map(list.map((p) => [p.slug, p])).values());
    return unique.map((p: any) => ({
      title: String(p.title),
      slug: String(p.slug),
    }));
  } catch {
    return [];
  }
};

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    getProjects().then((loaded) => setProjects(loaded));
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
      <CommandInput placeholder="Search for a project..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {projects.map((item) => (
          <CommandItem
            key={item.slug}
            onSelect={() => {
              router.push(`/${item.slug}`);
              setOpen(false);
            }}
          >
            {item.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
