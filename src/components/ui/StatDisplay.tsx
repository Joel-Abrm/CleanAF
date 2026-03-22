"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { STAT_COLORS } from "@/types";
import type { StatType } from "@/types";

interface StatDisplayProps {
  stats: Record<StatType, number>;
}

const STAT_LABELS: Record<StatType, string> = {
  strength: "Strength",
  intelligence: "Intelligence",
  discipline: "Discipline",
  willpower: "Willpower",
};

const STAT_ICONS: Record<StatType, string> = {
  strength: "⚔️",
  intelligence: "🧠",
  discipline: "🎯",
  willpower: "⚡",
};

export function StatDisplay({ stats }: StatDisplayProps) {
  const maxStat = Math.max(...Object.values(stats), 1);
  const prevStats = useRef<Record<StatType, number>>({ ...stats });

  return (
    <div className="grid grid-cols-4 gap-2">
      {(Object.keys(stats) as StatType[]).map((stat, i) => {
        const color = STAT_COLORS[stat];
        const pct = (stats[stat] / maxStat) * 100;
        const gained = stats[stat] > (prevStats.current[stat] ?? 0);

        return (
          <motion.div
            key={stat}
            className="flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {/* Icon */}
            <motion.span
              className="text-base"
              animate={gained ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {STAT_ICONS[stat]}
            </motion.span>

            {/* XP label */}
            <motion.div
              className="text-xs font-mono font-bold"
              style={{ color }}
              key={stats[stat]}
              animate={gained ? { scale: [1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              +{stats[stat]}
            </motion.div>

            {/* Mini bar */}
            <div className="w-full h-1.5 bg-shadow-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>

            <span className="text-[9px] text-gray-500 capitalize truncate w-full text-center">
              {STAT_LABELS[stat].slice(0, 4)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
