"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export function ElevenLabsCreative({
  size = 120,
  pixel = 5,
  gap = 1,
  edgeFeather = 0,
  className,
}: {
  size?: number;
  pixel?: number;
  gap?: number;
  edgeFeather?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const controls = useAnimation();

  // Create floating particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        hue: 200 + Math.random() * 160, // Blue to pink range
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          // Bounce off edges
          if (Math.abs(newX) > 100) newVx *= -1;
          if (Math.abs(newY) > 100) newVy *= -1;

          // Add some randomness
          newVx += (Math.random() - 0.5) * 0.02;
          newVy += (Math.random() - 0.5) * 0.02;

          // Limit speed
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > 1) {
            newVx = (newVx / speed) * 1;
            newVy = (newVy / speed) * 1;
          }

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            hue: p.hue + 0.5, // Slowly shift color
          };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  function mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const { maskUrl, pixelData } = useMemo(() => {
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
    let pixels: { x: number; y: number; opacity: number }[] = [];

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
          const dropChance = 0.5 * (1 - t);
          if (rng() < dropChance) continue;
          op = 0.8 + 0.2 * t;
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
        
        // Store pixel data for interactive effects
        pixels.push({ x: (x / vb) * size, y: (y / vb) * size, opacity: op });
      }
    }

    const svg = `<?xml version='1.0'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${vb}' height='${vb}' viewBox='0 0 ${vb} ${vb}'>\n  ${rects.join("\n  ")}\n</svg>`;

    return { 
      maskUrl: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
      pixelData: pixels
    };
  }, [pixel, gap, edgeFeather, size]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Remove 3D rotation - keep logo stable
  const rotateX = useTransform(mouseY, [-60, 60], [0, 0]);
  const rotateY = useTransform(mouseX, [-60, 60], [0, 0]);

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative select-none cursor-pointer", className)}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      aria-hidden
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: `hsl(${particle.hue % 360}, 80%, 60%)`,
              left: "50%",
              top: "50%",
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity * (isHovered ? 1.5 : 1),
              boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue % 360}, 80%, 60%)`,
            }}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: particle.id * 0.1,
            }}
          />
        ))}
      </div>

      {/* Dynamic glow that responds to hover */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
      >
        <div className="absolute inset-[-50%] flex justify-center items-center">
          <motion.div 
            className="w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(147,51,234,0.3) 50%, rgba(236,72,153,0.2) 100%)",
              filter: "blur(40px)",
            }}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
        </div>
      </motion.div>

      {/* Logo container - kept stable and centered */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center"
      >

        {/* Solid white logo to ensure visibility */}
        <div
          className={cn(
            "absolute inset-0",
            "[mask-image:var(--mask-url)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]",
            "bg-gradient-to-br from-white/95 to-white/85"
          )}
          style={{
            // @ts-ignore
            "--mask-url": maskUrl,
            filter: isHovered ? "brightness(1.1)" : "brightness(1)",
          }}
        />

        {/* Animated shimmer layer */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none mix-blend-overlay opacity-50",
            "[mask-image:var(--mask-url)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]"
          )}
          style={{
            // @ts-ignore
            "--mask-url": maskUrl,
            backgroundImage: isHovered
              ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "0% 0%",
            animation: `shimmer ${isHovered ? 2 : 4}s ease-in-out infinite`,
          }}
        />

      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}