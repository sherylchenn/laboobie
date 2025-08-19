"use client";

import Link from "next/link";
import type React from "react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";
import { CodeBlock } from "./code-block";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

type PreProps = ComponentPropsWithoutRef<"pre">;

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const components = {
  h1: (props: HeadingProps) => (
    <h1 className="font-medium mt-6 mb-0 text-2xl first:mt-0" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="text-gray-800 dark:text-zinc-200 font-medium mt-5 mb-0 text-xl first:mt-0"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="text-gray-800 dark:text-zinc-200 font-medium mt-4 mb-0 text-lg first:mt-0"
      {...props}
    />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="font-medium mt-3 mb-0 first:mt-0" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p
      className="text-gray-800 dark:text-zinc-300 leading-[1.6] mt-2 mb-0 first:mt-0"
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol
      className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 mt-2 mb-0 first:mt-0"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-gray-800 dark:text-zinc-300 list-disc pl-5 mt-2 mb-0 first:mt-0"
      {...props}
    />
  ),
  li: (props: ListItemProps) => (
    <li className="pl-1 mt-1 mb-0 first:mt-0" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      "text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 underline underline-offset-2";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const content = String(children ?? "");
    if (!inline && match) {
      return <CodeBlock code={content} language={match[1]} />;
    }
    // inline code
    const codeHTML = highlight(content);
    return (
      <code
        className="bg-muted/50 rounded px-1.5 py-0.5"
        dangerouslySetInnerHTML={{ __html: codeHTML }}
        {...props}
      />
    );
  },
  pre: (props: PreProps) => (
    <pre className="mt-2 mb-0 first:mt-0 overflow-auto" {...props} />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-4 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300 mt-2 mb-0 first:mt-0"
      {...props}
    />
  ),
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="max-w-none text-[15px] leading-[1.65]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: [
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "ml-1 no-underline",
                ],
              },
            },
          ],
        ]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
