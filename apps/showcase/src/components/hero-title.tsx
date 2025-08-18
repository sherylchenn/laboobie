"use client";

export function HeroTitle() {
  return (
    <div className="text-center mb-12">
      <h1
        className="text-[32px] mb-3 font-waldenburg-hf font-medium"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards",
        }}
      >
        ElevenLabs v3
      </h1>

      <p
        className="text-[#878787] text-base max-w-[500px] mx-auto"
        style={{
          opacity: 0,
          animation: "fadeIn 0.2s ease forwards 0.1s",
        }}
      >
        Introducing the most advanced text-to-speech model in the world.
        Natural, expressive, and indistinguishable from human speech.
      </p>
      {/* <CardComponent
        company={{
          id: "elevenlabs",
          title: "ElevenLabs",
          logo: "/elevenlabs.svg",
          src: "/elevenlabs.svg",
          discountLink: "https://elevenlabs.com",
        }}
      /> */}
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
