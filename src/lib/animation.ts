/**
 * animation.ts — Shared timing, easing, and sequencing constants.
 *
 * Every animated component imports from here so the whole system
 * feels like one coherent engine rather than independent parts.
 *
 * The complete habit-complete sequence:
 *
 *   0 ms   — tap feedback (checkbox scale-down, row sweep start)
 *   80 ms  — XP floater appears
 *   180 ms — particles fire (after floater is visible)
 *   400 ms — XP bar begins filling
 *   600 ms — bar glow peaks, XP total ticks up
 *  1800 ms — level-up modal opens (if levelled up)
 */

// ─── DELAYS (ms) ──────────────────────────────────────────────────────────────

export const TIMING = {
  // Habit row
  TAP_FEEDBACK:     0,    // immediate scale-down on press
  SWEEP_START:      0,    // color sweep across row
  FLOATER_APPEAR:   80,   // XP number floats up
  PARTICLES_FIRE:   180,  // particle burst (after floater visible)
  SCREEN_FLASH:     180,  // edge flash (same beat as particles)

  // XP bar
  BAR_FILL_START:   400,  // bar starts filling after floater peaks
  BAR_GLOW_PEAK:    600,  // glow brightest
  XP_TOTAL_TICK:    500,  // counter ticks up

  // Level-up
  LEVEL_UP_OPEN:    1800, // modal opens after bar settles
  LEVEL_UP_CONFETTI: 300, // confetti relative to modal open

  // All-quests-done banner
  ALL_DONE_BANNER:  300,  // after last habit completes
} as const;

// ─── DURATIONS (ms) ───────────────────────────────────────────────────────────

export const DURATION = {
  FLOATER:          900,
  PARTICLES:        700,
  SCREEN_FLASH:     500,
  SWEEP:            380,
  BURST_RING:       480,
  BAR_FILL:         700,
  BAR_GLOW:         600,
  XP_TOTAL:         400,
  LEVEL_UP_ENTER:   500,
  MODAL_BACKDROP:   250,
} as const;

// ─── EASING ───────────────────────────────────────────────────────────────────
// Named so intent is clear at call sites

/** Fast in, elastic out — great for things appearing (checkmark, badge pop) */
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;

/** Smooth deceleration — fills, slides, fades */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Standard iOS-style spring used for most UI motion */
export const SPRING_SNAPPY = { type: "spring", stiffness: 380, damping: 22 } as const;

/** Slower spring for larger elements (modal enter) */
export const SPRING_MODAL  = { type: "spring", stiffness: 260, damping: 22 } as const;

/** Heavy spring for emphasis (level number drop) */
export const SPRING_HEAVY  = { type: "spring", stiffness: 180, damping: 14 } as const;

// ─── SOUND HOOKS (no-op stubs — swap in real audio at any time) ───────────────
// Each function is a named hook so they're easy to find and replace.
// To add real audio: install `use-sound` and replace the bodies.

type SoundFn = () => void;

function noop(): void {}

export const sounds: Record<string, SoundFn> = {
  /** Short click — fired on every habit tap */
  habitTap:    noop,

  /** Satisfying "ding" — fired when habit completes */
  habitDone:   noop,

  /** Rising chime — fired when XP bar starts filling */
  xpGain:      noop,

  /** Fanfare — fired when level-up modal opens */
  levelUp:     noop,

  /** Soft chime — fired when all quests cleared */
  allDone:     noop,
};

/*
 * HOW TO WIRE UP REAL SOUNDS:
 *
 *   npm install use-sound
 *
 *   In any component:
 *     import { sounds } from "@/lib/animation";
 *     import useSound from "use-sound";
 *
 *     const [playDone] = useSound("/sounds/habit-done.mp3", { volume: 0.5 });
 *     sounds.habitDone = playDone;
 *
 *   Put the .mp3 files in /public/sounds/.
 *   Recommended free sources: freesound.org, zapsplat.com
 */
