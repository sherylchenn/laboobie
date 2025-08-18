import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Project } from "../../../../packages/data/src/projects";
import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";

function truncateContent(content: string, limit: number) {
  if (content.length <= limit) return content;
  return `${content.slice(0, limit)}...`;
}

export function ProjectCardSmall({
  sample,
  isPage,
  small,
}: {
  sample: Project;
  isPage?: boolean;
  small?: boolean;
}) {
  return (
    <Card
      className={cn(
        "bg-background max-h-[calc(100vh-8rem)] flex flex-col",
        small ? "p-2" : "p-4 aspect-square",
      )}
    >
      <CardContent
        className={cn(
          "bg-card h-full mb-2 font-mono pr-1 text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow",
          small ? "p-2" : "p-4",
          isPage && "opacity-100",
        )}
      >
        <div
          className={cn(
            "group-hover:flex hidden right-4 bottom-4 absolute z-10 space-x-2",
            small ? "right-2 bottom-2" : "right-4 bottom-4",
          )}
        >
          <ShareButton slug={sample.slug} small={small} />
          <CopyButton
            content={sample.content}
            slug={sample.slug}
            small={small}
          />
        </div>

        <Link href={`/${sample.slug}`}>
          <div className="h-full overflow-y-auto">
            <code className={cn("block pr-3", small ? "text-xs" : "text-sm")}>
              {small
                ? truncateContent(sample.content, small ? 70 : 200)
                : sample.content}
            </code>
          </div>
        </Link>
      </CardContent>

      <CardHeader className="p-0 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className={cn("truncate", small ? "text-xs" : "text-sm")}>
            {sample.title || sample.author?.name}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
