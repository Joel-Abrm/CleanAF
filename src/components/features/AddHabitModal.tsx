"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { STAT_COLORS } from "@/types";
import type { StatType } from "@/types";
import { createHabit } from "@/lib/actions";

interface AddHabitModalProps {
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}

const STATS: StatType[] = ["strength", "intelligence", "discipline", "willpower"];
const STAT_ICONS: Record<StatType, string> = {
  strength: "💪",
  intelligence: "🧠",
  discipline: "⚡",
  willpower: "🌊",
};

export function AddHabitModal({ userId, onClose, onCreated }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [xpReward, setXpReward] = useState(20);
  const [statType, setStatType] = useState<StatType>("discipline");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) return;
    setLoading(true);
    await createHabit(userId, name.trim(), xpReward, statType);
    setLoading(false);
    onCreated();
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-shadow-card border border-shadow-border rounded-t-3xl p-6 space-y-5"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-mono font-bold text-lg">New Quest</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Quest Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meditate 10 min"
              className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-colors text-sm"
              autoFocus
            />
          </div>

          {/* Stat type */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Stat Type</label>
            <div className="grid grid-cols-4 gap-2">
              {STATS.map((stat) => {
                const active = statType === stat;
                const color = STAT_COLORS[stat];
                return (
                  <button
                    key={stat}
                    onClick={() => setStatType(stat)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                    style={{
                      borderColor: active ? color : "rgba(255,255,255,0.08)",
                      backgroundColor: active ? color + "20" : "transparent",
                      boxShadow: active ? `0 0 12px ${color}30` : "none",
                    }}
                  >
                    <span className="text-xl">{STAT_ICONS[stat]}</span>
                    <span className="text-[10px] font-mono capitalize" style={{ color: active ? color : "#666" }}>
                      {stat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP reward */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              XP Reward: <span className="text-neon-blue">{xpReward}</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full accent-neon-blue"
            />
            <div className="flex justify-between text-[10px] text-gray-600 font-mono">
              <span>5 XP</span><span>50 XP</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className="w-full py-3 rounded-xl font-mono font-bold text-sm transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #4F9FFF, #9B6FFF)",
              boxShadow: "0 0 20px rgba(79,159,255,0.3)",
            }}
          >
            {loading ? "Creating..." : "Begin Quest"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
