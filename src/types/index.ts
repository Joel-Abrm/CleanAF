// Core database types matching Supabase schema

export interface User {
  id: string;
  email: string;
  username?: string;
  level: number;
  xp: number;
  streak: number;
  class?: "Warrior" | "Mage" | "Shadow";
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  xp_reward: number;
  stat_type: StatType;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // ISO date string
  completed: boolean;
}

export interface Urge {
  id: string;
  user_id: string;
  date: string;
  result: "resisted" | "relapsed";
}

export type StatType = "strength" | "intelligence" | "discipline" | "willpower";

export interface UserStats {
  strength: number;
  intelligence: number;
  discipline: number;
  willpower: number;
}

// XP thresholds per level (cumulative)
export const XP_PER_LEVEL = 100;
export const getXpForNextLevel = (level: number) => level * XP_PER_LEVEL;
export const getXpProgress = (xp: number, level: number) => {
  const base = (level - 1) * XP_PER_LEVEL;
  const needed = XP_PER_LEVEL;
  return Math.min(((xp - base) / needed) * 100, 100);
};

// Stat colors
export const STAT_COLORS: Record<StatType, string> = {
  strength: "#FF6B35",
  intelligence: "#9B6FFF",
  discipline: "#4F9FFF",
  willpower: "#00E5FF",
};

// Stat icons
export const STAT_XP_REWARDS: Record<StatType, number> = {
  strength: 8,
  intelligence: 3,
  discipline: 5,
  willpower: 3,
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
