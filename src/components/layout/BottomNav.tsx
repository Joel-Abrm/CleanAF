"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Swords, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/progress", label: "Progress", icon: BarChart2 },
  { href: "/battle", label: "Battle (Urge)", icon: Swords },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-shadow-card/95 backdrop-blur-md border-t border-shadow-border">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="relative flex flex-col items-center gap-1 px-4 py-1">
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-neon-blue rounded-full"
                    style={{ boxShadow: "0 0 8px #4F9FFF" }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors",
                    active ? "text-neon-blue" : "text-gray-500"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-neon-blue" : "text-gray-500"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
