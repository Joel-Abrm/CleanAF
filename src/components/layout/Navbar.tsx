"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BarChart2, Swords, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/progress", label: "Progress", icon: BarChart2 },
  { href: "/battle", label: "Battle (Urge)", icon: Swords },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-shadow-card/95 backdrop-blur-md border-t border-shadow-border">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-neon-blue/10 rounded-xl border border-neon-blue/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors relative z-10",
                    active ? "text-neon-blue" : "text-gray-500"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium relative z-10",
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
