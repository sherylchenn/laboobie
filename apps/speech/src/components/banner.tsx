"use client";

import { useOpenPanel } from "@openpanel/nextjs";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Banner() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const pathname = usePathname();
  const op = useOpenPanel();

  useEffect(() => {
    setCurrentBannerIndex(0);
  }, []);

  const [isAnimating, setIsAnimating] = useState(true); // Start as true
  const [animateDirection, setAnimateDirection] = useState<"up" | "down">("up");

  const banners = [
    {
      id: "elevenlabs",
      href: "https://dub.sh/elevenlabs-home",
      logo: (
        <svg
          width={20}
          height={20}
          fill="none"
          className="absolute left-4 top-5"
          viewBox="0 0 229 229"
        >
          <path d="M43 1H90.8809V229H43V1Z" fill="white" />
          <path d="M138.119 1H186V229H138.119V1Z" fill="white" />
        </svg>
      ),
      title: "ElevenLabs",
      description:
        "The most realistic voice AI platform. Sign up to ElevenLabs today ↗",
    },
  ];

  useEffect(() => {
    // Show banner after 2s delay on pathname change
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) return;

    // Initial animation up
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [isVisible]);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsAnimating(true);
    setAnimateDirection("down");
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const slideClass = isAnimating
    ? animateDirection === "down"
      ? "animate-out slide-out-to-bottom duration-300"
      : "animate-in slide-in-from-bottom-full duration-300"
    : "";

  const currentBanner = banners[currentBannerIndex];

  if (!isVisible) return null;

  // Hide banner on /generate page
  if (
    pathname === "/generate" ||
    pathname.includes("/games") ||
    pathname.includes("/board") ||
    pathname.endsWith("/new") ||
    pathname.endsWith("/edit")
  ) {
    return null;
  }

  return (
    <a
      href={currentBanner.href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        op.track("banner_clicked", {
          banner_id: currentBanner.id,
          banner_url: currentBanner.href,
          type: "banner",
        });
      }}
    >
      <div
        className={`fixed overflow-hidden ${slideClass} z-50 bottom-4 md:bottom-4 left-4 md:left-auto right-4 md:right-4 w-[calc(100vw-32px)] md:w-[calc(100vw-16px)] md:max-w-[370px] border border-border p-4 transition-all bg-background h-[88px] group`}
      >
        {currentBanner.logo}

        <div className="flex justify-between">
          <div className="flex flex-col space-y-0.5 pl-[40px]">
            <div className="flex space-x-2 items-center">
              <span className="text-sm font-medium">{currentBanner.title}</span>
            </div>
            <p className="text-xs text-[#878787]">
              {currentBanner.description}
            </p>
          </div>

          <button
            type="button"
            className="absolute right-1.5 top-1.5 text-[#878787] hidden group-hover:block"
            onClick={handleClose}
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </a>
  );
}
