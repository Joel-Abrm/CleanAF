import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "purple" | "green" | "red" | "none";
}

export function Card({ className, glow = "none", children, ...props }: CardProps) {
  const glowMap = {
    blue: "shadow-glow-blue border-neon-blue/30",
    purple: "shadow-glow-purple border-neon-purple/30",
    green: "shadow-glow-green border-neon-green/30",
    red: "shadow-glow-red border-neon-red/30",
    none: "border-shadow-border",
  };

  return (
    <div
      className={cn(
        "bg-shadow-card border rounded-2xl p-4 shadow-card",
        glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
