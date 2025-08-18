"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { Input } from "./ui/input";

export function SearchInput({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });

  return (
    <Input
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={cn(
        "w-full border-border placeholder:text-[#565656] outline-none focus:!ring-0",
        className,
      )}
    />
  );
}
