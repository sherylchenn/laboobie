"use client";

export function HeroTitle() {
  return (
    <div className="relative isolate mx-auto max-w-3xl text-center mb-12 px-6">
      <p
        className="text-white/70 text-[15px] leading-7 max-w-[640px] mx-auto"
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease forwards",
          animationDelay: "0.3s",
        }}
      >
        Explore a curated gallery of voice and audio experiences built with
        ElevenLabs. From conversational agents to music creation and
        accessibility tools. Discover what creators and teams are shipping
        today.
      </p>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
