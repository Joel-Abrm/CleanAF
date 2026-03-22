"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { XpBar } from "@/components/ui/XpBar";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { getLevelFromXp, getHunterRank } from "@/lib/utils";

// Static achievements — in production these would come from DB
const ACHIEVEMENTS = [
  { id: "1", icon: "🏆", title: "First Week Strong", description: "Complete 7 days of habits", unlocked: true },
  { id: "2", icon: "⚔️", title: "Urge Breaker", description: "Resist 5 urges total", unlocked: true },
  { id: "3", icon: "🌟", title: "Earned Badot", description: "Reach Level 5", unlocked: false },
  { id: "4", icon: "🔥", title: "On Fire", description: "Maintain a 14-day streak", unlocked: false },
  { id: "5", icon: "💎", title: "Diamond Will", description: "Resist 50 urges", unlocked: false },
  { id: "6", icon: "🚀", title: "Ascended", description: "Reach Level 20", unlocked: false },
];

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const level = user ? getLevelFromXp(user.xp) : 1;
  const rank = getHunterRank(level);

  return (
    <PageWrapper>
      {/* Avatar + Name */}
      <div className="text-center mb-6">
        <motion.div
          className="w-24 h-24 mx-auto rounded-full border-2 border-neon-blue/50 bg-neon-blue/10 flex items-center justify-center text-4xl mb-4"
          animate={{ boxShadow: ["0 0 20px rgba(79,159,255,0.3)", "0 0 40px rgba(79,159,255,0.5)", "0 0 20px rgba(79,159,255,0.3)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧙
        </motion.div>
        <h1 className="text-xl font-bold text-white">
          {user?.username ?? user?.email?.split("@")[0] ?? "Hunter"}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
      </div>

      {/* Stats card */}
      <Card glow="blue" className="mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Rank</p>
            <p className="font-bold text-neon-blue">{rank}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Level</p>
            <p className="font-bold font-mono text-white">+ {level}</p>
          </div>
        </div>
        <XpBar xp={user?.xp ?? 0} level={level} />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>🔥 {user?.streak ?? 0} day streak</span>
          <span>{user?.xp ?? 0} XP total</span>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="mb-4">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🏅</span> Achievements / Badges
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1 text-center"
              title={ach.description}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border transition-all ${
                  ach.unlocked
                    ? "border-neon-gold/50 bg-neon-gold/10"
                    : "border-shadow-border bg-shadow-muted opacity-40 grayscale"
                }`}
                style={ach.unlocked ? { boxShadow: "0 0 16px rgba(255,184,0,0.3)" } : {}}
              >
                {ach.icon}
              </div>
              <p className={`text-[10px] leading-tight ${ach.unlocked ? "text-gray-300" : "text-gray-600"}`}>
                {ach.title}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ borderColor: "rgba(255,68,68,0.5)", color: "#FF4444" }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 border border-shadow-border rounded-xl text-gray-500 flex items-center justify-center gap-2 transition-all"
      >
        <LogOut size={16} />
        Sign Out
      </motion.button>
    </PageWrapper>
  );
}
