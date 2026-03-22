import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { XP_PER_LEVEL } from "@/types";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Calculate level from total XP */
export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** Get XP progress within current level (0–100) */
export function getXpProgress(xp: number): number {
  const remainder = xp % XP_PER_LEVEL;
  return (remainder / XP_PER_LEVEL) * 100;
}

/** XP needed for next level */
export function getXpToNextLevel(xp: number): number {
  const remainder = xp % XP_PER_LEVEL;
  return XP_PER_LEVEL - remainder;
}

/** Format large numbers */
export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Hunter rank based on level */
export function getHunterRank(level: number): string {
  if (level >= 50) return "S-Class Hunter";
  if (level >= 30) return "A-Class Hunter";
  if (level >= 20) return "B-Class Hunter";
  if (level >= 10) return "C-Class Hunter";
  if (level >= 5) return "D-Class Hunter";
  return "E-Class Hunter";
}

/** Today's ISO date string */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}
