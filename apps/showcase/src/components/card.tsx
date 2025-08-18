import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import CompanySveltePokemonCard from "./pokemon-card";

export const CardComponent = ({
  onPokemonCardClick,
}: {
  onPokemonCardClick?: () => void;
}) => {
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
