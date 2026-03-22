"use client";

import { useState, useCallback } from "react";
import { TIMING, DURATION, sounds } from "@/lib/animation";

export interface XpEffect {
  id: number;
  amount: number;
  x: number;
  y: number;
}

let nextId = 0;

/** Radial DOM particle burst — called from hook so XpFloater stays pure React */
function spawnParticles(x: number, y: number) {
  const color = "#00FF88";
  const COUNT = 6; // fewer = cleaner

  for (let i = 0; i < COUNT; i++) {
    const angle = (i / COUNT) * 2 * Math.PI + Math.random() * 0.4;
    const dist  = 28 + Math.random() * 24;
    const el    = document.createElement("div");
    el.className = "particle";
    el.style.cssText = `
      left:${x}px;top:${y}px;
      background:${color};
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      box-shadow:0 0 5px ${color};
      width:${4+Math.random()*3}px;height:${4+Math.random()*3}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), DURATION.PARTICLES);
  }
}

/** Subtle radial edge flash */
function flashScreen() {
  const el = document.createElement("div");
  el.className = "screen-edge-flash";
  el.style.background =
    "radial-gradient(ellipse at center,transparent 50%,rgba(0,255,136,0.10) 100%)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), DURATION.SCREEN_FLASH);
}

export function useXpEffect() {
  const [effects, setEffects] = useState<XpEffect[]>([]);

  const triggerXp = useCallback((amount: number, x?: number, y?: number) => {
    const id = ++nextId;
    const cx = x ?? (typeof window !== "undefined" ? window.innerWidth  / 2 : 200);
    const cy = y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 300);
    const jx = (Math.random() - 0.5) * 16;
    const jy = (Math.random() - 0.5) * 16;

    // Beat 1 — immediate tap sound
    sounds.habitTap();

    // Beat 2 — floater appears (slight anticipation delay)
    setTimeout(() => {
      setEffects(prev => [...prev, { id, amount, x: cx + jx, y: cy + jy }]);
    }, TIMING.FLOATER_APPEAR);

    // Beat 3 — particles + flash after floater is already visible
    setTimeout(() => {
      spawnParticles(cx + jx, cy + jy);
      flashScreen();
      sounds.habitDone();
    }, TIMING.PARTICLES_FIRE);

    // Cleanup
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, TIMING.FLOATER_APPEAR + DURATION.FLOATER + 100);
  }, []);

  return { effects, triggerXp };
}
