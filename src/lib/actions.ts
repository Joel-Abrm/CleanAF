"use client";

import { createClient } from "@/lib/supabase/client";
import { today } from "@/lib/utils";
import type { Habit, StatType, User } from "@/types";

// ─── USER ─────────────────────────────────────────────────────────────────────

export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as User | null;
}

export async function upsertUserProfile(
  id: string,
  email: string,
  username?: string
) {
  const supabase = createClient();
  return supabase.from("users").upsert(
    {
      id,
      email,
      username: username ?? email.split("@")[0],
      level: 1,
      xp: 0,
      streak: 0,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}

export async function addXpToUser(userId: string, amount: number) {
  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("xp, level")
    .eq("id", userId)
    .single();

  if (!user) return;

  const newXp = (user.xp || 0) + amount;
  const newLevel = Math.floor(newXp / 100) + 1;

  await supabase
    .from("users")
    .update({ xp: newXp, level: newLevel })
    .eq("id", userId);

  return { newXp, newLevel, leveledUp: newLevel > user.level };
}

export async function deductXpFromUser(userId: string, amount: number) {
  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("xp, level")
    .eq("id", userId)
    .single();

  if (!user) return;

  const newXp = Math.max(0, (user.xp || 0) - amount);
  const newLevel = Math.floor(newXp / 100) + 1;

  await supabase
    .from("users")
    .update({ xp: newXp, level: newLevel })
    .eq("id", userId);
}

export async function updateStreak(userId: string, streak: number) {
  const supabase = createClient();
  return supabase.from("users").update({ streak }).eq("id", userId);
}

// ─── HABITS ───────────────────────────────────────────────────────────────────

export async function getHabits(userId: string): Promise<Habit[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data as Habit[]) ?? [];
}

export async function createHabit(
  userId: string,
  name: string,
  xpReward: number,
  statType: StatType
) {
  const supabase = createClient();
  const { data, error } = await supabase.from("habits").insert({
    user_id: userId,
    name,
    xp_reward: xpReward,
    stat_type: statType,
  });
  console.log("createHabit:", { data, error });
  return { data, error };
}

export async function deleteHabit(habitId: string) {
  const supabase = createClient();
  return supabase.from("habits").delete().eq("id", habitId);
}

// ─── LOGS ─────────────────────────────────────────────────────────────────────

export async function getTodayLogs(userId: string): Promise<string[]> {
  const supabase = createClient();

  const { data: userHabits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId);

  if (!userHabits || userHabits.length === 0) return [];

  const { data } = await supabase
    .from("logs")
    .select("habit_id")
    .in("habit_id", userHabits.map((h: { id: string }) => h.id))
    .eq("date", today());

  return (data ?? []).map((l: { habit_id: string }) => l.habit_id);
}

export async function completeHabit(
  habitId: string,
  userId: string,
  xpReward: number
) {
  const supabase = createClient();
  await supabase.from("logs").insert({
    habit_id: habitId,
    date: today(),
    completed: true,
  });

  return addXpToUser(userId, xpReward);
}

export async function getAllLogs(userId: string) {
  const supabase = createClient();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const { data: userHabits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId);

  if (!userHabits || userHabits.length === 0) return [];

  const { data } = await supabase
    .from("logs")
    .select("date")
    .in("habit_id", userHabits.map((h: { id: string }) => h.id))
    .gte("date", startDate.toISOString().split("T")[0]);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((log: { date: string }) => {
    counts[log.date] = (counts[log.date] || 0) + 1;
  });

  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

// ─── URGES ────────────────────────────────────────────────────────────────────

export async function logUrge(userId: string, result: "won" | "lost") {
  const supabase = createClient();

  // Check if urge already logged today — update instead of insert
  const { data: existing } = await supabase
    .from("urges")
    .select("id")
    .eq("user_id", userId)
    .eq("date", today())
    .single();

  if (existing) {
    await supabase
      .from("urges")
      .update({ result })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("urges")
      .insert({ user_id: userId, date: today(), result });
  }

  if (result === "won") {
    // Get current streak and add XP
    const { data: user } = await supabase
      .from("users")
      .select("xp, level, streak")
      .eq("id", userId)
      .single();

    if (!user) return;

    const newXp     = (user.xp || 0) + 10;
    const newLevel  = Math.floor(newXp / 100) + 1;
    const newStreak = (user.streak || 0) + 1;

    await supabase
      .from("users")
      .update({ xp: newXp, level: newLevel, streak: newStreak })
      .eq("id", userId);

    return { newXp, newLevel, leveledUp: newLevel > user.level };
  } else {
    // Reset streak, no XP
    await supabase
      .from("users")
      .update({ streak: 0 })
      .eq("id", userId);
  }
}

export async function getUrgeStats(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("urges")
    .select("result")
    .eq("user_id", userId);

  const resisted = (data ?? []).filter((u: { result: string }) => u.result === "resisted").length;
  const relapsed = (data ?? []).filter((u: { result: string }) => u.result === "relapsed").length;

  return { resisted, relapsed, total: resisted + relapsed };
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export async function getUserStats(userId: string) {
  const supabase = createClient();

  const { data: userHabits } = await supabase
    .from("habits")
    .select("id, stat_type, xp_reward")
    .eq("user_id", userId);

  const stats = { strength: 0, intelligence: 0, discipline: 0, willpower: 0 };
  if (!userHabits || userHabits.length === 0) return stats;

  const { data: logs } = await supabase
    .from("logs")
    .select("habit_id")
    .in("habit_id", userHabits.map((h: { id: string }) => h.id))
    .eq("completed", true);

  (logs ?? []).forEach((log: { habit_id: string }) => {
    const habit = userHabits.find((h: { id: string }) => h.id === log.habit_id);
    if (habit) {
      const stat = habit.stat_type as keyof typeof stats;
      if (stat in stats) stats[stat] += habit.xp_reward;
    }
  });

  return stats;
}