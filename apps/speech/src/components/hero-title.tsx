"use client";

export function HeroTitle() {
  const text = "ElevenLabs V3";

  return (
    <div className="text-center mb-12">
      <h1
        className="text-[32px] font-medium mb-3"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards",
        }}
      >
        {text}
      </h1>

      <p
        className="text-[#878787] text-base max-w-[500px] mx-auto"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards 0.1s",
        }}
      >
        Introducing the most advanced text-to-speech model in the world. Natural, expressive, and 
        indistinguishable from human speech.
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
