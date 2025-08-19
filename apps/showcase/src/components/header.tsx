"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { CommandMenu } from "./command-menu";
import { MobileMenu } from "./mobile-menu";
import { Button } from "./ui/button";

const navigationLinks = [
  { href: "/projects", label: "Explore" },
  {
    href: "https://github.com/elevenlabs/showcase",
    label: "Submit",
    target: "_blank",
  },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const mainNavItems = navigationLinks.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 h-14 bg-background/20 backdrop-filter backdrop-blur-sm bg-opacity-30">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/">
          <div className="relative w-[100px] h-[40px]">
            <Image
              src="/logo.svg"
              alt="ElevenLabs Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-5">
          {mainNavItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                pathname.includes(link.href)
                  ? "text-primary"
                  : "text-[#878787]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
