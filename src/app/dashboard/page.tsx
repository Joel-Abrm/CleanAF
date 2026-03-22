"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Zap, Trophy } from "lucide-react";
import { PageWrapper }      from "@/components/layout/PageWrapper";
import { Card }             from "@/components/ui/Card";
import { XpBar }            from "@/components/ui/XpBar";
import { HabitItem }        from "@/components/ui/HabitItem";
import { StatDisplay }      from "@/components/ui/StatDisplay";
import { LevelUpModal }     from "@/components/features/LevelUpModal";
import { CreateHabitModal } from "@/components/features/CreateHabitModal";
import { XpFloater }        from "@/components/ui/XpFloater";
import { useUser }          from "@/hooks/useUser";
import { useXpEffect }      from "@/hooks/useXpEffect";
import { getLevelFromXp, getHunterRank } from "@/lib/utils";
import { TIMING, sounds }   from "@/lib/animation";
import {
  getHabits, getTodayLogs, completeHabit,
  createHabit, deleteHabit, getUserStats,
} from "@/lib/actions";
import type { Habit, StatType, UserStats } from "@/types";

export default function DashboardPage() {
  const { user, refresh } = useUser();
  const { effects, triggerXp } = useXpEffect();

  const [habits,       setHabits]       = useState<Habit[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [stats,        setStats]        = useState<UserStats>({ strength:0, intelligence:0, discipline:0, willpower:0 });
  const [showCreate,   setShowCreate]   = useState(false);
  const [levelUpAt,    setLevelUpAt]    = useState<number | null>(null);
  const [questsOpen,   setQuestsOpen]   = useState(true);
  const [allDone,      setAllDone]      = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [h, logs, s] = await Promise.all([
      getHabits(user.id),
      getTodayLogs(user.id),
      getUserStats(user.id),
    ]);
    setHabits(h);
    setCompletedIds(new Set(logs));
    setStats(s);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const done = habits.length > 0 && completedIds.size === habits.length;
    if (done && !allDone) sounds.allDone();
    setAllDone(done);
  }, [habits, completedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleComplete(habit: Habit, e: React.MouseEvent) {
    if (!user || completedIds.has(habit.id)) return;

    // Optimistic UI
    setCompletedIds(prev => new Set([...prev, habit.id]));

    // XP floater fires at FLOATER_APPEAR inside triggerXp
    triggerXp(habit.xp_reward, e.clientX, e.clientY);

    const result = await completeHabit(habit.id, user.id, habit.xp_reward);

    // Level-up opens AFTER the XP bar has had time to fill (1800ms)
    if (result?.leveledUp) {
      setTimeout(() => setLevelUpAt(result.newLevel), TIMING.LEVEL_UP_OPEN);
    }

    await refresh();
    await loadData();
  }

  async function handleCreateHabit(name: string, xp: number, stat: StatType) {
    if (!user) return;
    await createHabit(user.id, name, xp, stat);
    await loadData();
  }

  async function handleDelete(habitId: string) {
    await deleteHabit(habitId);
    await loadData();
  }

  const level          = getLevelFromXp(user?.xp ?? 0);
  const rank           = getHunterRank(level);
  const todayCompleted = habits.filter(h => completedIds.has(h.id)).length;

  return (
    <PageWrapper>
      <XpFloater effects={effects} />

      <AnimatePresence>
        {levelUpAt && (
          <LevelUpModal level={levelUpAt} onClose={() => setLevelUpAt(null)} />
        )}
        {showCreate && (
          <CreateHabitModal
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreateHabit}
          />
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className="w-11 h-11 rounded-full bg-neon-blue/20 border-2 border-neon-blue/40 flex items-center justify-center text-lg"
              animate={{ borderColor: ["rgba(79,159,255,0.3)","rgba(79,159,255,0.7)","rgba(79,159,255,0.3)"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🧙
            </motion.div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center text-[9px] font-bold font-mono text-shadow-bg">
              {level}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">
              {user?.username ?? user?.email?.split("@")[0] ?? "Hunter"}
            </p>
            <p className="text-xs text-neon-blue font-mono">{rank}</p>
          </div>
        </div>

        {/* Streak — pulse is slower, less frenetic */}
        <motion.div
          className="flex items-center gap-1.5 bg-neon-gold/10 border border-neon-gold/30 rounded-full px-3 py-1.5 streak-flare"
          whileTap={{ scale: 0.93 }}
        >
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          >
            <Flame size={14} className="text-neon-gold" />
          </motion.div>
          <span className="text-neon-gold font-bold text-sm font-mono">
            {user?.streak ?? 0} day streak
          </span>
        </motion.div>
      </div>

      {/* ── XP Bar Card ──────────────────────────────── */}
      <Card glow="blue" className="mb-4">
        <XpBar xp={user?.xp ?? 0} level={level} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">{rank}</span>
          {/*
            XP total — uses `key={user?.xp}` so it re-mounts and re-runs
            the initial animation every time XP changes.
            Delay matches BAR_FILL_START so number ticks up with the bar.
          */}
          <motion.span
            key={user?.xp}
            className="text-xs font-mono"
            initial={{ color: "#00FF88", scale: 1.2 }}
            animate={{ color: "#4F9FFF", scale: 1 }}
            transition={{ duration: 0.5, delay: TIMING.XP_TOTAL_TICK / 1000 }}
          >
            {user?.xp ?? 0} XP total
          </motion.span>
        </div>
      </Card>

      {/* ── Quest List ───────────────────────────────── */}
      <Card className="mb-4">
        <div
          className="flex items-center justify-between mb-3 cursor-pointer"
          onClick={() => setQuestsOpen(!questsOpen)}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-neon-gold" />
            <h2 className="font-semibold text-white">Today&apos;s Quests</h2>
            <motion.span
              className="text-xs px-2 py-0.5 rounded-full font-mono border"
              animate={allDone ? {
                backgroundColor: "rgba(0,255,136,0.18)",
                borderColor:     "rgba(0,255,136,0.45)",
                color:           "#00FF88",
              } : {
                backgroundColor: "rgba(79,159,255,0.10)",
                borderColor:     "rgba(79,159,255,0.28)",
                color:           "#4F9FFF",
              }}
              transition={{ duration: 0.5 }}
            >
              {todayCompleted}/{habits.length}
            </motion.span>
          </div>
          <motion.span
            animate={{ rotate: questsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 text-sm"
          >
            ▲
          </motion.span>
        </div>

        <AnimatePresence>
          {questsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden space-y-2"
            >
              {/* All-done banner — delayed so it doesn't collide with last habit animation */}
              <AnimatePresence>
                {allDone && habits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, delay: ALL_DONE_DELAY }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1"
                    style={{
                      background: "linear-gradient(135deg,rgba(0,255,136,0.10),rgba(79,159,255,0.06))",
                      border: "1px solid rgba(0,255,136,0.30)",
                    }}
                  >
                    <motion.div
                      initial={{ rotate: -30 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12, delay: ALL_DONE_DELAY + 0.05 }}
                    >
                      <Trophy size={15} className="text-neon-gold" />
                    </motion.div>
                    <span className="text-sm font-bold text-neon-green">Daily cleared.</span>
                    <span className="text-xs text-gray-500 ml-auto font-mono">
                      {habits.length}/{habits.length} ✓
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {habits.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">
                  No quests yet. Add your first one! ⚔️
                </p>
              ) : (
                habits.map(habit => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    completed={completedIds.has(habit.id)}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))
              )}

              <motion.button
                onClick={() => setShowCreate(true)}
                whileHover={{ borderColor: "rgba(79,159,255,0.45)", color: "#9CA3AF" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 mt-1 rounded-xl border border-dashed border-shadow-border text-gray-500 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={14} />
                Add Quest
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Stats ────────────────────────────────────── */}
      <Card>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Stats Growth
        </h2>
        <StatDisplay stats={stats} />
      </Card>
    </PageWrapper>
  );
}

// Seconds — used in JSX so must be outside component to avoid inline magic numbers
const ALL_DONE_DELAY = TIMING.ALL_DONE_BANNER / 1000;
