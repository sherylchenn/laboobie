import Image from "next/image";
import CompanySveltePokemonCard from "./pokemon-card";

export const CardComponent = ({
  onPokemonCardClick,
  variant = "default",
}: {
  onPokemonCardClick?: () => void;
  variant?: "default" | "header";
}) => {
  if (variant === "header") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-sm ring-1 ring-inset ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage:
                "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
              maskImage:
                "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
            }}
          >
            <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />
          </div>
          <div className="relative flex items-center gap-6 p-6 sm:p-8">
            <div className="relative w-28 h-40 shrink-0 rounded-2xl overflow-hidden">
              <Image
                src="/card.png"
                alt=""
                fill
                className="object-cover opacity-70 mix-blend-luminosity"
                priority
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-waldenburg-hf text-white/90">
                ElevenLabs
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Ultra‑realistic text‑to‑speech that feels human.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className={"mb-4 z-0 isolate z-99"}>
        <CompanySveltePokemonCard
          companyId={"elevenlabs"}
          svelteCardProps={{
            id: "1",
            name: "ElevenLabs",
            img: "/card.png",
            back: "/card-back.png",
            number: "001",
            types: ["Fire"],
            supertype: "Pokémon",
            subtypes: ["Basic"],
            rarity: "rare holo vmax",
          }}
          onClick={onPokemonCardClick}
        />
      </div>
    </div>
  );
};
