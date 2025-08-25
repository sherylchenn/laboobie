"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function ElevenLabs({
  size = 96,
  pixel = 5, // pixel size in SVG units (logo viewBox = 229)
  gap = 1, // spacing between pixels
  edgeFeather = 0,
  className,
}: {
  size?: number;
  pixel?: number;
  gap?: number;
  edgeFeather?: number;
  className?: string;
}) {
  function mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const maskUrl = useMemo(() => {
    const vb = 229;
    const barW = 47.881;
    const barH = 228;
    const r = 8;
    const leftX = 43;
    const rightX = 138.119;
    const topY = 1;

    const rng = mulberry32(11);

    function insideBar(x: number, y: number, barX: number) {
      const withinX = x >= barX && x <= barX + barW;
      const withinY = y >= topY && y <= topY + barH;
      if (!withinX || !withinY) return false;
      const relX = Math.min(x - barX, barX + barW - x);
      const relY = Math.min(y - topY, topY + barH - y);
      if (relX < r && relY < r) {
        const dx = r - relX;
        const dy = r - relY;
        return dx * dx + dy * dy <= r * r;
      }
      return true;
    }

    function distToEdge(x: number, y: number, barX: number) {
      const dx = Math.min(Math.abs(x - barX), Math.abs(barX + barW - x));
      const dy = Math.min(Math.abs(y - topY), Math.abs(topY + barH - y));
      return Math.min(dx, dy);
    }

    let rects: string[] = [];

    for (let gy = 0; gy <= vb; gy += pixel) {
      for (let gx = 0; gx <= vb; gx += pixel) {
        const cx = gx + pixel / 2;
        const cy = gy + pixel / 2;

        let inLeft = insideBar(cx, cy, leftX);
        let inRight = insideBar(cx, cy, rightX);
        if (!(inLeft || inRight)) continue;

        const barX = inLeft ? leftX : rightX;
        const d = distToEdge(cx, cy, barX);

        let op = 1;
        if (d < edgeFeather) {
          const t = d / edgeFeather;
          const dropChance = 0.5 * (1 - t); // lowered drop chance
          if (rng() < dropChance) continue;
          op = 0.8 + 0.2 * t; // raised base opacity
        }

        const w = Math.max(1, pixel - gap);
        const h = Math.max(1, pixel - gap);
        const x = gx + (pixel - w) / 2;
        const y = gy + (pixel - h) / 2;

        rects.push(
          `<rect x='${x.toFixed(2)}' y='${y.toFixed(2)}' width='${w}' height='${h}' fill='white' opacity='${op.toFixed(
            2
          )}' />`
        );
      }
    }

    const svg = `<?xml version='1.0'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${vb}' height='${vb}' viewBox='0 0 ${vb} ${vb}'>\n  ${rects.join("\n  ")}\n</svg>`;

    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [pixel, gap, edgeFeather]);

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0",
          "[mask-image:var(--mask-url)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]",
          "supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-200 supports-[backdrop-filter]:backdrop-contrast-125 supports-[backdrop-filter]:backdrop-brightness-110",
          "supports-[backdrop-filter]:shadow-[0_0_20px_rgba(255,255,255,0.3),0_0_40px_rgba(255,255,255,0.1)]"
        )}
        style={{
          // @ts-ignore
          "--mask-url": maskUrl,
          WebkitBackdropFilter: "blur(24px) saturate(2) contrast(1.25) brightness(1.1)",
          backdropFilter: "blur(24px) saturate(2) contrast(1.25) brightness(1.1)",
        }}
      />

      <div
        className={cn(
          "absolute inset-0 supports-[backdrop-filter]:hidden",
          "[mask-image:var(--mask-url)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]",
          "bg-white/95 shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_10px_30px_rgba(0,0,0,0.2)]"
        )}
        style={{
          // @ts-ignore
          "--mask-url": maskUrl,
        }}
      />

      <div
        className={cn(
          "absolute inset-0 pointer-events-none mix-blend-screen opacity-70",
          "[mask-image:var(--mask-url)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]"
        )}
        style={{
          // @ts-ignore
          "--mask-url": maskUrl,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.00) 100%)",
          backgroundSize: "200% 100%",
          animation: "elv-shimmer 12s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes elv-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
