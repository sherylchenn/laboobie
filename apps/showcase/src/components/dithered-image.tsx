"use client";

export function DitheredImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* base image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${className ?? ""} w-full h-full object-cover select-none`}
        loading="lazy"
        style={{ filter: "saturate(0.85) contrast(1.06) brightness(1.02)" }}
      />

      {/* tiny pixel-dot dither, matched to the smoky wave grain */}
      {/* layer 1: soft-light white micro dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "soft-light",
          opacity: 0.5,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 0.45px, transparent 0.46px), radial-gradient(circle, rgba(255,255,255,0.35) 0.35px, transparent 0.36px)",
          backgroundSize: "2px 2px, 3px 3px",
          backgroundPosition: "0 0, 1px 1px",
        }}
      />
      {/* layer 2: multiply dark micro dots to add subtle depth in highlights */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0.2,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.28) 0.5px, transparent 0.6px)",
          backgroundSize: "3px 3px",
          backgroundPosition: "0.5px 0.5px",
        }}
      />

      {/* color grading overlay to unify palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "color",
          opacity: 0.12,
          background:
            "linear-gradient(180deg, rgba(168,197,255,0.9) 0%, rgba(255,209,177,0.9) 100%)",
        }}
      />
      {/* subtle contrast shaping */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "soft-light",
          opacity: 0.18,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* gentle top sheen to tie into the Vision Pro glass aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 35%)",
        }}
      />

      {/* stronger radial vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 85%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(160% 140% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 95%)",
        }}
      />
    </div>
  );
}
