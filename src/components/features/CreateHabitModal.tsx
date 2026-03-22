"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { STAT_COLORS } from "@/types";
import type { StatType } from "@/types";

const STAT_OPTIONS: { value: StatType; label: string; icon: string; xp: number }[] = [
  { value: "strength", label: "Strength", icon: "💪", xp: 20 },
  { value: "intelligence", label: "Intelligence", icon: "🧠", xp: 15 },
  { value: "discipline", label: "Discipline", icon: "⚡", xp: 20 },
  { value: "willpower", label: "Willpower", icon: "🌊", xp: 15 },
];

interface CreateHabitModalProps {
  onClose: () => void;
  onSubmit: (name: string, xp: number, stat: StatType) => Promise<void>;
}

export function CreateHabitModal({ onClose, onSubmit }: CreateHabitModalProps) {
  const [name, setName] = useState("");
  const [selectedStat, setSelectedStat] = useState<StatType>("discipline");
  const [loading, setLoading] = useState(false);

  const selectedOption = STAT_OPTIONS.find((s) => s.value === selectedStat)!;

  async function handleSubmit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name.trim(), selectedOption.xp, selectedStat);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md bg-shadow-card border border-shadow-border rounded-2xl p-6 mb-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Quest</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Name input */}
        <div className="mb-5">
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
            Quest Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Meditate 10 minutes"
            className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-colors"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Stat selection */}
        <div className="mb-6">
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
            Stat Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STAT_OPTIONS.map((opt) => {
              const color = STAT_COLORS[opt.value];
              const active = selectedStat === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStat(opt.value)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all"
                  style={{
                    backgroundColor: active ? `${color}18` : "transparent",
                    borderColor: active ? `${color}60` : "#1A2540",
                    boxShadow: active ? `0 0 12px ${color}25` : "none",
                  }}
                >
                  <span>{opt.icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-medium text-white">{opt.label}</p>
                    <p className="text-[10px]" style={{ color }}>+{opt.xp} XP</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="w-full py-3 rounded-xl font-bold text-shadow-bg transition-all disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #4F9FFF, #9B6FFF)",
            boxShadow: "0 4px 20px rgba(79,159,255,0.3)",
          }}
        >
          {loading ? "Creating..." : "Begin Quest"}
        </button>
      </motion.div>
    </motion.div>
  );
}
