"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { useUser } from "@/hooks/useUser";
import { getAllLogs, getUrgeStats } from "@/lib/actions";
import { getLevelFromXp, getHunterRank } from "@/lib/utils";

interface HeatmapEntry { date: string; count: number }
interface UrgeStats { resisted: number; relapsed: number; total: number }

// Simple heatmap that avoids the react-calendar-heatmap SSR issues
function SimpleHeatmap({ data }: { data: HeatmapEntry[] }) {
  const dateMap = new Map(data.map((d) => [d.date, d.count]));
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Generate last 35 days (5 weeks)
  const days: string[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  function getColor(count: number): string {
    if (!count) return "#1A2540";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "#0D3B6E";
    if (intensity < 0.5) return "#1565C0";
    if (intensity < 0.75) return "#2196F3";
    return "#00E5FF";
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] text-gray-600 mb-0.5">{d}</div>
        ))}
        {days.map((date) => {
          const count = dateMap.get(date) ?? 0;
          return (
            <motion.div
              key={date}
              title={`${date}: ${count} habits`}
              className="aspect-square rounded-sm"
              style={{ backgroundColor: getColor(count) }}
              whileHover={{ scale: 1.3 }}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[10px] text-gray-600">Less</span>
        {["#1A2540", "#0D3B6E", "#1565C0", "#2196F3", "#00E5FF"].map((c) => (
          <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[10px] text-gray-600">Max</span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useUser();
  const [heatmapData, setHeatmapData] = useState<HeatmapEntry[]>([]);
  const [urgeStats, setUrgeStats] = useState<UrgeStats>({ resisted: 0, relapsed: 0, total: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([getAllLogs(user.id), getUrgeStats(user.id)]).then(([logs, urges]) => {
      setHeatmapData(logs);
      setUrgeStats(urges);
    });
  }, [user]);

  const level = user ? getLevelFromXp(user.xp) : 1;
  const rank = getHunterRank(level);
  const resistRate = urgeStats.total > 0
    ? Math.round((urgeStats.resisted / urgeStats.total) * 100)
    : 0;

  return (
    <PageWrapper>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold font-mono text-white">PROGRESS</h1>
        <p className="text-gray-500 text-sm">Your journey so far</p>
      </div>

      {/* Streak + Best */}
      <Card glow="blue" className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current streak</p>
            <p className="text-3xl font-bold font-mono text-neon-green">{user?.streak ?? 0}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Level</p>
            <p className="text-3xl font-bold font-mono text-neon-blue">{level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Rank</p>
            <p className="text-sm font-bold text-neon-purple">{rank}</p>
          </div>
        </div>

        {/* Completion count */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-full">
            {heatmapData.reduce((s, d) => s + d.count, 0)} total completions
          </span>
          <span className="text-xs text-gray-500">/</span>
          <span className="text-xs text-gray-500">keep going!</span>
        </div>
      </Card>

      {/* Heatmap */}
      <Card className="mb-4">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>📅</span> Daily Contribution
        </h2>
        <SimpleHeatmap data={heatmapData} />
      </Card>

      {/* Urge stats */}
      <Card>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>⚔️</span> Battle Record
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Resisted", value: urgeStats.resisted, color: "text-neon-green" },
            { label: "Relapsed", value: urgeStats.relapsed, color: "text-neon-red" },
            { label: "Win Rate", value: `${resistRate}%`, color: "text-neon-blue" },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              className="bg-shadow-muted rounded-xl py-3"
              whileHover={{ scale: 1.03 }}
            >
              <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Win rate bar */}
        {urgeStats.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Resistance rate</span>
              <span>{resistRate}%</span>
            </div>
            <div className="h-2 bg-shadow-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${resistRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </Card>
    </PageWrapper>
  );
}
