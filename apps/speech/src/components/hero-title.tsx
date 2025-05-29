"use client";

import Link from "next/link";

export function HeroTitle() {
  const text = "ElevenLabs V3 is here";

  return (
    <div className="text-center mb-8">
      <h1
        className="text-[21px] mb-2"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards",
        }}
      >
        {text}
      </h1>

      <p
        className="text-[#878787] text-sm max-w-[620px] mx-auto"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards 0.1s",
        }}
      >
        The home for Cursor enthusiasts where you can explore and{" "}
        <Link href="/generate" className="border-b border-border border-dashed">
          generate
        </Link>{" "}
        rules, browse{" "}
        <Link href="/mcp" className="border-b border-border border-dashed">
          MCPs
        </Link>
        , post and follow the latest news on the board, learn, connect, and
        discover{" "}
        <Link href="/jobs" className="border-b border-border border-dashed">
          jobs
        </Link>{" "}
        all in one place.
      </p>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
