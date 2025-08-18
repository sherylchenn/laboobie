"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const navigationLinks = [{ href: "/projects", label: "Projects" }] as const;

type User = {
  id: string;
  slug: string;
  name?: string;
  email?: string;
  image?: string;
};

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div className="md:hidden mr-4">
        {user ? (
          <Avatar
            className="size-6 rounded-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AvatarImage src={user?.image} className="rounded-none" />
            <AvatarFallback className="text-xs bg-[#878787]">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="ghost"
            className="p-0 w-8 h-8"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[99999] bg-background w-screen h-screen top-[50px] bottom-0 p-4"
          >
            <div className="flex flex-col">
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: navigationLinks.length * 0.02 + index * 0.02,
                    duration: 0.1,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block py-5 text-sm font-medium",
                      pathname === link.href
                        ? "text-primary"
                        : "text-[#878787]",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
