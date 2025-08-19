"use client";

import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";
import { highlight } from "sugar-high";

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const html = highlight(code);
  const label = language ? language.toLowerCase() : undefined;

  return (
    <div
      className={cn(
        "relative group border border-border rounded-md overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground bg-muted/50">
        <span className="uppercase tracking-wide">{label ?? "code"}</span>
        <CopyButton content={code} slug="code" small />
      </div>
      <pre className="m-0 p-3 overflow-auto bg-background">
        <code
          className="[&_span]:font-mono text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}
