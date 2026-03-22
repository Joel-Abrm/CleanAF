"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAT_COLORS } from "@/types";
import { SPRING_SNAPPY, EASE_OUT_BACK, DURATION } from "@/lib/animation";
import type { Habit, StatType } from "@/types";

interface HabitItemProps {
  habit: Habit;
  completed: boolean;
  onComplete: (habit: Habit, e: React.MouseEvent) => void;
  onDelete: (habitId: string) => void;
}

const STAT_ICONS: Record<StatType, string> = {
  strength:     "💪",
  intelligence: "🧠",
  discipline:   "⚡",
  willpower:    "🌊",
};

/**
 * Feedback messages — short, punchy, game-appropriate.
 * Avoided generic words ("well done", "excellent") in favour of
 * language that feels like a game system notifying you.
 */
const FEEDBACK: Record<StatType, string[]> = {
  strength:     ["STR +1", "Power channelled.", "Body hardened."],
  intelligence: ["INT +1", "Mind sharpened.", "Knowledge claimed."],
  discipline:   ["DISC +1", "Will forged.", "Habit locked in."],
  willpower:    ["WILL +1", "Urge overcome.", "Inner strength grows."],
};

function pickFeedback(stat: StatType): string {
  const pool = FEEDBACK[stat];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Habit row animation sequence (all relative to tap at t=0):
 *
 *   t=0ms   — checkbox scales down (tap feedback)
 *   t=0ms   — row sweep begins
 *   t=60ms  — checkmark springs in
 *   t=100ms — burst ring expands
 *   t=120ms — stat icon wiggles
 *   t=200ms — XP badge pulses
 *   t=300ms — feedback text fades in
 *   t=900ms — feedback text fades out
 */
export function HabitItem({ habit, completed, onComplete, onDelete }: HabitItemProps) {
  const [hovered,       setHovered]       = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [feedback]                        = useState(() => pickFeedback(habit.stat_type as StatType));
  const color = STAT_COLORS[habit.stat_type as StatType];

  function handleClick(e: React.MouseEvent) {
    if (completed) return;
    setJustCompleted(true);
    onComplete(habit, e);
    setTimeout(() => setJustCompleted(false), 1000);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.22, ease: EASE_OUT_BACK }}
      className={cn(
        "relative flex items-center gap-3 p-3 rounded-xl border overflow-hidden",
        "transition-colors duration-300",
        completed
          ? "bg-neon-green/5 border-neon-green/20 opacity-60"
          : "bg-shadow-muted/40 border-shadow-border"
      )}
      // Lift only when uncompleted — don't animate completed rows
      whileHover={completed ? {} : {
        y: -1,
        borderColor: `${color}50`,
        transition: { duration: 0.15 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Completion sweep — left-to-right fill */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `linear-gradient(90deg, ${color}28 0%, ${color}0a 60%, transparent 100%)`,
            }}
            initial={{ scaleX: 0, originX: "0%" }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.SWEEP / 1000, ease: EASE_OUT_BACK }}
          />
        )}
      </AnimatePresence>

      {/* ── Checkbox ─────────────────────────────────── */}
      <div className="relative flex-shrink-0">
        {/* Burst ring — appears at t=100ms */}
        <AnimatePresence>
          {justCompleted && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `1.5px solid ${color}` }}
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{}}
              transition={{
                duration: DURATION.BURST_RING / 1000,
                delay: 0.1,
                ease: "easeOut",
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          aria-label={`Complete ${habit.name}`}
          whileTap={completed ? {} : { scale: 0.68 }}
          onClick={handleClick}
          transition={SPRING_SNAPPY}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            "transition-colors duration-200 focus:outline-none",
            completed
              ? "bg-neon-green border-neon-green"
              : "border-gray-600 hover:border-neon-blue"
          )}
          style={completed ? { boxShadow: "0 0 8px rgba(0,255,136,0.4)" } : {}}
        >
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ ...SPRING_SNAPPY, delay: 0.06 }}
              >
                <Check size={11} className="text-shadow-bg" strokeWidth={3.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Stat icon — wiggles at t=120ms ───────────── */}
      <motion.span
        className="text-base flex-shrink-0"
        animate={justCompleted ? {
          rotate: [0, -12, 12, -6, 6, 0],
          scale:  [1, 1.25, 1],
        } : {}}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        {STAT_ICONS[habit.stat_type as StatType]}
      </motion.span>

      {/* ── Name ─────────────────────────────────────── */}
      <span
        className={cn(
          "flex-1 text-sm font-medium leading-snug",
          "transition-all duration-400",
          completed ? "line-through text-gray-500" : "text-gray-200"
        )}
      >
        {habit.name}
      </span>

      {/* ── Inline feedback text ─────────────────────── */}
      <AnimatePresence>
        {justCompleted && (
          <motion.span
            className="absolute left-10 bottom-1 text-[10px] font-mono font-semibold pointer-events-none"
            style={{ color, textShadow: `0 0 8px ${color}60` }}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            {feedback}
          </motion.span>
        )}
      </AnimatePresence>

      {/* ── XP badge — pulses at t=200ms ─────────────── */}
      <motion.span
        className="text-xs font-bold font-mono px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          color,
          backgroundColor: `${color}1a`,
          border: `1px solid ${color}38`,
        }}
        animate={justCompleted ? {
          scale:     [1, 1.22, 1],
          boxShadow: [`0 0 0px ${color}00`, `0 0 14px ${color}`, `0 0 4px ${color}40`],
        } : {}}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        +{habit.xp_reward} XP
      </motion.span>

      {/* ── Delete button ─────────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => onDelete(habit.id)}
            className="text-gray-600 hover:text-neon-red transition-colors ml-1 flex-shrink-0"
            aria-label="Delete habit"
          >
            <Trash2 size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
