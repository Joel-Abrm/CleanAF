"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getXpProgress, getXpToNextLevel } from "@/lib/utils";
import { TIMING, DURATION, EASE_OUT_EXPO, sounds } from "@/lib/animation";

interface XpBarProps {
  xp: number;
  level: number;
  showLabel?: boolean;
}

/**
 * XP bar animation sequence (relative to habit completion at t=0):
 *
 *   t=400ms  BAR_FILL_START  — spring begins moving toward new value
 *   t=500ms  XP_TOTAL_TICK   — "X XP total" counter flashes green
 *   t=600ms  BAR_GLOW_PEAK   — glow brightens, then settles
 *
 * The deliberate 400ms gap after the floater creates a satisfying
 * cause→effect feel: you see the XP reward *before* the bar moves.
 */
export function XpBar({ xp, level, showLabel = true }: XpBarProps) {
  const progress    = getXpProgress(xp);
  const toNext      = getXpToNextLevel(xp);
  const prevXp      = useRef(xp);
  const [filling, setFilling] = useState(false);

  // Spring-animated bar width — stiffness tuned so fill takes ~700ms
  const raw    = useMotionValue(progress);
  const spring = useSpring(raw, { stiffness: 55, damping: 16, mass: 1 });
  const width  = useTransform(spring, v => `${v}%`);

  useEffect(() => {
    if (xp === prevXp.current) return;

    const gained = xp > prevXp.current;
    prevXp.current = xp;

    if (gained) {
      // Delay the bar fill so it follows the floater, not precedes it
      setTimeout(() => {
        setFilling(true);
        raw.set(progress);
        sounds.xpGain();
      }, TIMING.BAR_FILL_START);

      setTimeout(() => setFilling(false), TIMING.BAR_FILL_START + DURATION.BAR_FILL + 100);
    } else {
      // XP loss (relapse penalty) — animate immediately, no celebration
      raw.set(progress);
    }
  }, [xp, progress, raw]);

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-neon-blue font-mono">XP progress</span>
          <motion.span
            key={toNext}
            className="text-gray-400 font-mono"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
          >
            {toNext} to next level
          </motion.span>
        </div>
      )}

      {/* Track */}
      <div className="relative h-3 bg-shadow-muted rounded-full overflow-hidden">

        {/* Fill — gradient shifts from blue→green only while filling */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width,
            background: filling
              ? "linear-gradient(90deg, #4F9FFF, #00FF88)"
              : "linear-gradient(90deg, #4F9FFF, #9B6FFF)",
            boxShadow: filling
              ? "0 0 16px rgba(0,255,136,0.7)"
              : "0 0 10px rgba(79,159,255,0.5)",
            transition: "background 0.5s ease, box-shadow 0.5s ease",
          }}
        />

        {/* Glow pulse — single pulse at BAR_GLOW_PEAK, not looping */}
        {filling && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: "rgba(0,255,136,0.22)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: DURATION.BAR_GLOW / 1000,
              delay: (TIMING.BAR_GLOW_PEAK - TIMING.BAR_FILL_START) / 1000,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Shimmer — always on, low opacity so it doesn't compete */}
        <motion.div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPositionX: ["200%", "-200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
