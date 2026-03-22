"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { XpEffect } from "@/hooks/useXpEffect";
import { DURATION, EASE_OUT_EXPO } from "@/lib/animation";

interface XpFloaterProps {
  effects: XpEffect[];
}

/**
 * Pure rendering component — no side-effects.
 * All particle/flash logic lives in useXpEffect so this stays simple.
 *
 * Animation intent:
 *   - Pops up from tap point with a fast elastic scale
 *   - Drifts upward and fades out cleanly
 *   - Glow underline sweeps in right after the text appears
 */
export function XpFloater({ effects }: XpFloaterProps) {
  return (
    <AnimatePresence>
      {effects.map((effect) => (
        <motion.div
          key={effect.id}
          className="fixed pointer-events-none z-[9999] flex flex-col items-center select-none"
          style={{ left: effect.x - 28, top: effect.y - 16 }}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -72,
            scale: [0.6, 1.2, 1.05, 0.95],
          }}
          transition={{
            duration: DURATION.FLOATER / 1000,
            ease: EASE_OUT_EXPO,
            // Opacity fades only in the final 30% of the animation
            opacity: { times: [0, 0.15, 0.65, 1], ease: "linear" },
          }}
        >
          <span
            className="font-mono font-bold text-xl leading-none whitespace-nowrap"
            style={{
              color: "#00FF88",
              textShadow: "0 0 14px rgba(0,255,136,0.7)",
            }}
          >
            +{effect.amount} XP
          </span>

          {/* Underline sweeps in 60ms after text */}
          <motion.div
            className="h-px w-full rounded-full mt-0.5"
            style={{ background: "#00FF88", boxShadow: "0 0 6px #00FF88" }}
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
