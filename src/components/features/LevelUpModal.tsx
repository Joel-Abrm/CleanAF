"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHunterRank } from "@/lib/utils";
import { TIMING, SPRING_MODAL, SPRING_HEAVY, EASE_OUT_EXPO, sounds } from "@/lib/animation";

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

/**
 * Level-up modal sequence (all relative to modal mount at t=0):
 *
 *   t=0ms    — backdrop fades in
 *   t=0ms    — card springs up from below
 *   t=200ms  — "LEVEL UP" text letter-spaces out
 *   t=350ms  — level number drops in with heavy spring
 *   t=500ms  — rank badge slides up
 *   t=600ms  — flavour text fades
 *   t=700ms  — stat boosts reveal one-by-one (staggered 80ms apart)
 *   t=900ms  — continue button appears
 *   t=LEVEL_UP_CONFETTI — confetti fires (relative to open)
 *
 * Auto-closes after 7s. User can also tap anywhere or the button.
 */

function launchConfetti() {
  const colors = ["#FFB800", "#4F9FFF", "#00FF88", "#9B6FFF", "#FF6B35"];
  // 40 pieces instead of 60 — less chaos, more intentional
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const color = colors[i % colors.length];
      const size  = 4 + Math.random() * 5;
      const el    = document.createElement("div");

      el.style.cssText = `
        position:fixed;
        left:${window.innerWidth * 0.25 + Math.random() * window.innerWidth * 0.5}px;
        top:${window.innerHeight * 0.35}px;
        width:${size}px;height:${size}px;
        background:${color};
        border-radius:${Math.random() > 0.4 ? "50%" : "2px"};
        pointer-events:none;z-index:9999;
        box-shadow:0 0 4px ${color};
        animation:particleFly 1.1s ease-out forwards;
        --tx:${(Math.random()-0.5)*260}px;
        --ty:${Math.random()*-360-80}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }, i * 25); // stagger each piece 25ms apart
  }
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const rank        = getHunterRank(level);
  const didLaunch   = useRef(false);

  useEffect(() => {
    if (didLaunch.current) return;
    didLaunch.current = true;
    sounds.levelUp();
    setTimeout(launchConfetti, TIMING.LEVEL_UP_CONFETTI);
  }, []);

  // Auto-close after 7s
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  const statBoosts = [
    { label: "STR", color: "#FF6B35" },
    { label: "INT", color: "#9B6FFF" },
    { label: "DISC", color: "#4F9FFF" },
    { label: "WILL", color: "#00E5FF" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      {/* Emanating rings — restrained: only 2, slower */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neon-gold/25 pointer-events-none"
          style={{ width: 160, height: 160 }}
          animate={{ scale: [1, 5 + i * 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="relative text-center max-w-xs w-full mx-4"
        initial={{ scale: 0.6, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.05, opacity: 0, y: -16 }}
        transition={SPRING_MODAL}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden bg-shadow-card rounded-3xl px-8 py-10 border border-neon-gold/50"
          style={{ boxShadow: "0 0 60px rgba(255,184,0,0.28),0 0 120px rgba(255,184,0,0.10)" }}
        >
          {/* Scan line — single slow sweep, not looping */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,rgba(79,159,255,0.6),transparent)" }}
            initial={{ top: "-2px" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.4, ease: "linear", delay: 0.1 }}
          />

          {/* Corner brackets */}
          {(["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"] as const).map(pos => (
            <div
              key={pos}
              className={`absolute ${pos} w-5 h-5 border-neon-gold/50`}
              style={{
                borderTopWidth:    pos.includes("top")    ? "2px" : "0",
                borderBottomWidth: pos.includes("bottom") ? "2px" : "0",
                borderLeftWidth:   pos.includes("left")   ? "2px" : "0",
                borderRightWidth:  pos.includes("right")  ? "2px" : "0",
              }}
            />
          ))}

          {/* Sword icon — flips once */}
          <motion.div
            className="text-5xl mb-4"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT_EXPO }}
          >
            ⚔️
          </motion.div>

          {/* "LEVEL UP" — letter-spaces in */}
          <motion.p
            className="font-mono text-[11px] uppercase text-neon-gold mb-2"
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.38em" }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT_EXPO }}
          >
            Level Up
          </motion.p>

          {/* Level number — heavy spring drop */}
          <motion.p
            className="text-8xl font-bold font-mono text-white leading-none"
            initial={{ scale: 1.8, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ ...SPRING_HEAVY, delay: 0.35 }}
            style={{ textShadow: "0 0 24px #FFB800,0 0 48px #FFB80050" }}
          >
            {level}
          </motion.p>

          {/* Rank badge */}
          <motion.div
            className="inline-block mt-3 mb-2 px-4 py-1 bg-neon-gold/12 border border-neon-gold/35 rounded-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5, ease: EASE_OUT_EXPO }}
          >
            <p className="text-sm font-bold text-neon-gold font-mono">{rank}</p>
          </motion.div>

          {/* Flavour text */}
          <motion.p
            className="text-gray-400 text-sm mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            Discipline forged. Power earned.
          </motion.p>

          {/* Stat boosts — stagger each 80ms */}
          <motion.div
            className="grid grid-cols-2 gap-2 mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden:  {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
            }}
          >
            {statBoosts.map(({ label, color }) => (
              <motion.div
                key={label}
                className="rounded-lg px-2 py-1.5 flex items-center justify-between"
                style={{ background: `${color}12`, border: `1px solid ${color}35` }}
                variants={{
                  hidden:  { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
                }}
              >
                <span style={{ color }} className="font-mono font-bold text-xs">{label}</span>
                <span style={{ color }} className="font-mono text-xs">↑</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(255,184,0,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-neon-gold/15 border border-neon-gold/55 text-neon-gold rounded-xl font-bold tracking-widest font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            CONTINUE →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
