"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"

interface SiteHeaderLogoProps {
  siteName: string
}

export function SiteHeaderLogo({ siteName }: SiteHeaderLogoProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <Button asChild variant="ghost" className="hidden h-10 px-3 lg:flex">
      <Link href="/" className="flex items-center gap-2">
        <Icons.logo className="size-6" />
        <Separator orientation="vertical" className="h-4" />
        <span className={cn(isHomePage ? "opacity-100" : "opacity-75")}>
          Showcase
        </span>
        <span className="sr-only">{siteName}</span>
      </Link>
    </Button>
  )
}
