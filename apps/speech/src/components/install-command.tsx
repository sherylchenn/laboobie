"use client";

import { cn } from "@/lib/utils";
import { Check, Share, Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InstallCommand({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`npx cursor-directory rules add ${slug}`);
    setCopied(true);
    toast("Command copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleCopy();
        }
      }}
    >
      <code className="text-xs bg-black text-white  rounded-full px-2 py-1">
        {`npx cursor-directory rules add ${slug.slice(0, 5)}...`}
      </code>
      <button
        onClick={handleCopy}
        className={cn(
          "text-xs bg-black text-white  rounded-full flex items-center justify-center w-9  h-9",
        )}
        type="button"
      >
        {copied ? (
          <Check className={"w-4 h-4"} />
        ) : (
          <Terminal className={"w-4 h-4"} />
        )}
      </button>
    </div>
  );
}
