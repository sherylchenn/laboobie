"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * Smoky, Apple‑like animated background
 * - Layered, softly‑blurred gradients
 * - Animated sine waves with parallax
 * - Procedural smoke (SVG fractal noise) subtly drifting
 * - Radial fade mask + vignette for depth
 *
 * Drop it near the root of your page (positioned parent).
 */
export function WaveBg({ className }: { className?: string }) {
  const pathsRef = useRef<Array<SVGPathElement | null>>([]);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const els = pathsRef.current.filter(Boolean) as SVGPathElement[];
    if (els.length === 0) return;

    const W = 1600;
    const H = 340;

    const draw = () => {
      t += 0.012; // slow, buttery

      // Each layer gets its own phase/amplitude to feel smoky & deep
      const layers = [
        { amp: 16, freq: 0.010, speed: 1.0, step: 22, lift: -6 },
        { amp: 12, freq: 0.014, speed: 1.4, step: 24, lift: 0 },
        { amp: 10, freq: 0.018, speed: 1.8, step: 26, lift: 6 },
      ];

      els.forEach((el, i) => {
        const { amp, freq, speed, step, lift } = layers[i % layers.length];
        const pts: Array<[number, number]> = [];
        for (let x = 0; x <= W; x += step) {
          const y =
            H / 2 +
            lift +
            Math.sin(x * freq + t * speed) * amp +
            Math.sin(x * freq * 0.33 + t * speed * 1.6) * (amp * 0.5) +
            Math.sin(x * freq * 0.12 + t * speed * 0.7) * (amp * 0.25);
          pts.push([x, y]);
        }
        const d =
          `M 0 ${H} L 0 ${pts[0][1].toFixed(1)} ` +
          pts.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") +
          ` L ${W} ${H} Z`;
        el.setAttribute("d", d);
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden [perspective:1000px]",
        className
      )}
      aria-hidden
    >
      {/* Soft vignette behind everything */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_0%,hsl(220_40%_12%/0.6),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_20%,hsl(270_45%_14%/0.55),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_15%_25%,hsl(328_50%_14%/0.5),transparent_60%)]" />
      </div>

      <svg
        className="w-[220%] h-[420px] -translate-y-14 -translate-x-[18%] blur-2xl opacity-[0.66] dark:opacity-[0.7] will-change-transform"
        viewBox="0 0 1600 340"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Colorway: muted, premium gradients with gentle luminance */}
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(215 92% 64% / 0.95)" />
            <stop offset="50%" stopColor="hsl(268 85% 66% / 0.95)" />
            <stop offset="100%" stopColor="hsl(330 82% 66% / 0.95)" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(206 90% 60% / 0.85)" />
            <stop offset="50%" stopColor="hsl(255 78% 64% / 0.85)" />
            <stop offset="100%" stopColor="hsl(318 78% 64% / 0.85)" />
          </linearGradient>
          <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(208 88% 58% / 0.75)" />
            <stop offset="50%" stopColor="hsl(248 76% 62% / 0.75)" />
            <stop offset="100%" stopColor="hsl(312 76% 62% / 0.75)" />
          </linearGradient>

          {/* Radial fade so waves melt into background */}
          <radialGradient id="fadeG" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="white" />
            <stop offset="70%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id="fadeMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeG)" />
          </mask>

          {/* Procedural smoke using fractal noise */}
          <filter id="smoke" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.01"
              numOctaves="3"
              seed="8"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="24s"
                values="0.004 0.009; 0.006 0.012; 0.004 0.009"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0"
              result="smokeAlpha"
            />
          </filter>

          {/* Gentle bloom to soften highlights */}
          <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feBlend in="SourceGraphic" in2="b" mode="screen" />
          </filter>
        </defs>

        <g mask="url(#fadeMask)" filter="url(#bloom)">
          {/* back wave (broad, darkest) */}
          <path ref={(el) => (pathsRef.current[0] = el)} fill="url(#waveGrad3)" />
          {/* mid wave */}
          <path ref={(el) => (pathsRef.current[1] = el)} fill="url(#waveGrad2)" />
          {/* front wave (brightest) */}
          <path ref={(el) => (pathsRef.current[2] = el)} fill="url(#waveGrad1)" />
        </g>

        {/* Smoke overlay layer with screen blend */}
        <g style={{ mixBlendMode: "screen" }} mask="url(#fadeMask)">
          <rect x="-10%" y="-10%" width="120%" height="120%" filter="url(#smoke)" fill="white" />
        </g>
      </svg>

      {/* Subtle grain on top to avoid banding (cheap CSS noise) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.06]",
          "[background-image:radial-gradient(circle_at_center,white_0.5px,transparent_0.6px)]",
          "[background-size:2px_2px]"
        )}
      />

      {/* Soft outer vignette for premium feel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_10%,transparent,transparent_55%,hsl(240_10%_6%/0.45))]" />
    </div>
  );
}
