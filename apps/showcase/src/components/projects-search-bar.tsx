"use client";

import { SearchBar } from "@/components/ui/search-bar";
import { useQueryState } from "nuqs";

export function ProjectsSearchBar() {
  const [q, setQ] = useQueryState("q");
  return (
    <div className="max-w-2xl">
      <SearchBar defaultValue={q ?? ""} onSearch={(val) => setQ(val || null)} />
    </div>
  );
} 