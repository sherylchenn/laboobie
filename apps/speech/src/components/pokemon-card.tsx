"use client";

import { useEffect, useRef, useState } from "react";
const SVELTE_SCRIPT_URL = "/svelte-cards/dist/assets/index.f2597a33.js";

const SVELTE_CSS_FILES = [
  "/svelte-cards/dist/assets/index.c9fa2768.css",
  "/svelte-cards/dist/css/global.css",
  "/svelte-cards/dist/css/cards/base.css",
  "/svelte-cards/dist/css/cards.css",
  "/svelte-cards/dist/css/cards/basic.css",
  "/svelte-cards/dist/css/cards/reverse-holo.css",
  "/svelte-cards/dist/css/cards/regular-holo.css",
  "/svelte-cards/dist/css/cards/cosmos-holo.css",
  "/svelte-cards/dist/css/cards/amazing-rare.css",
  "/svelte-cards/dist/css/cards/radiant-holo.css",
  "/svelte-cards/dist/css/cards/v-regular.css",
  "/svelte-cards/dist/css/cards/v-full-art.css",
  "/svelte-cards/dist/css/cards/v-max.css",
  "/svelte-cards/dist/css/cards/v-star.css",
  "/svelte-cards/dist/css/cards/trainer-full-art.css",
  "/svelte-cards/dist/css/cards/rainbow-holo.css",
  "/svelte-cards/dist/css/cards/rainbow-alt.css",
  "/svelte-cards/dist/css/cards/secret-rare.css",
  "/svelte-cards/dist/css/cards/trainer-gallery-holo.css",
  "/svelte-cards/dist/css/cards/trainer-gallery-v-regular.css",
  "/svelte-cards/dist/css/cards/trainer-gallery-v-max.css",
  "/svelte-cards/dist/css/cards/trainer-gallery-secret-rare.css",
  "/svelte-cards/dist/css/cards/shiny-rare.css",
  "/svelte-cards/dist/css/cards/shiny-v.css",
  "/svelte-cards/dist/css/cards/shiny-vmax.css",
  "/svelte-cards/dist/css/cards/swsh-pikachu.css",
];

// Helper to ensure the Svelte script is loaded only once
let svelteScriptLoaded = false;
let svelteScriptLoading = false;
const scriptLoadSubscribers: (() => void)[] = [];

function ensureSvelteScriptIsLoaded(callback: () => void) {
  if (svelteScriptLoaded) {
    callback();
    return;
  }
  scriptLoadSubscribers.push(callback);
  if (svelteScriptLoading) {
    return;
  }
  svelteScriptLoading = true;
  const script = document.createElement("script");
  script.src = SVELTE_SCRIPT_URL;
  script.async = true;
  script.onload = () => {
    svelteScriptLoaded = true;
    svelteScriptLoading = false;
    for (const sub of scriptLoadSubscribers) {
      sub();
    }
    scriptLoadSubscribers.length = 0; // Clear subscribers
  };
  script.onerror = () => {
    svelteScriptLoading = false;
  };
  document.body.appendChild(script);
}

declare global {
  interface Window {
    mountSvelteCard?: (targetElement: HTMLElement, props: unknown) => void; // You can be more specific with props type
  }
}

interface CompanySvelteCardProps {
  companyId: string | number; // Or just string/number depending on your data
  svelteCardProps: {
    img?: string;
    back?: string;
    [key: string]: unknown; // Allows for other properties
  };
  onClick?: () => void; // Added onClick prop
}

// To keep track of loaded CSS files across multiple instances of the component
const loadedCssFiles = new Set<string>();

function CompanySvelteCard({
  companyId,
  svelteCardProps,
  onClick,
}: CompanySvelteCardProps) {
  const svelteCardContainerRef = useRef<HTMLDivElement>(null);
  const [isSvelteScriptReady, setIsSvelteScriptReady] =
    useState(svelteScriptLoaded);

  useEffect(() => {
    // Logic to append CSS links to head
    for (const cssFileUrl of SVELTE_CSS_FILES) {
      if (!loadedCssFiles.has(cssFileUrl)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssFileUrl;
        document.head.appendChild(link);
        loadedCssFiles.add(cssFileUrl);
      }
    }

    // Cleanup function to remove CSS if the component unmounts and no other instances need them.
    // This part is optional and more complex; for now, let's focus on getting them loaded.
    // You might decide to leave them if cards can appear on multiple pages.
  }, []); // Empty dependency array means this runs once when the first instance mounts.

  useEffect(() => {
    ensureSvelteScriptIsLoaded(() => {
      setIsSvelteScriptReady(true);
    });
  }, [companyId]);

  useEffect(() => {
    if (
      isSvelteScriptReady &&
      svelteCardContainerRef.current &&
      window.mountSvelteCard
    ) {
      const adjustedProps = { ...svelteCardProps };

      window.mountSvelteCard(svelteCardContainerRef.current, adjustedProps);
    }
  }, [companyId, svelteCardProps, isSvelteScriptReady]); // Re-run if props change or script loads

  const containerId = `svelte-card-for-${companyId}`;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={svelteCardContainerRef}
      id={containerId}
      className="svelte-card-instance-wrapper"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!isSvelteScriptReady && <p>Loading Svelte card...</p>}
    </div>
  );
}

export default CompanySvelteCard;
