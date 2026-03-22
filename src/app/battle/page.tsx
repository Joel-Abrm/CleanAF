"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper }  from "@/components/layout/PageWrapper";
import { Card }         from "@/components/ui/Card";
import { XpFloater }    from "@/components/ui/XpFloater";
import { useUser }      from "@/hooks/useUser";
import { useXpEffect }  from "@/hooks/useXpEffect";
import { logUrge }      from "@/lib/actions";

type Phase = "idle" | "result";
type Outcome = "won" | "lost";

export default function BattlePage() {
  const { user, refresh } = useUser();
  const { effects, triggerXp } = useXpEffect();

  const [phase,   setPhase]   = useState<Phase>("idle");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleChoice(choice: Outcome) {
    if (!user || loading) return;
    setLoading(true);

    const result = await logUrge(user.id, choice);

    if (choice === "won" && result) {
      triggerXp(10, window.innerWidth / 2, window.innerHeight * 0.4);
    }

    setOutcome(choice);
    setPhase("result");
    setLoading(false);
    await refresh();
  }

  function reset() {
    setPhase("idle");
    setOutcome(null);
  }

  return (
    <PageWrapper>
      <XpFloater effects={effects} />

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold font-mono text-white">URGE LOG</h1>
        <p className="text-gray-500 text-sm mt-1">Be honest with yourself.</p>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Idle — two choices ─────────────────────── */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <Card className="mb-4 text-center py-8">
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚔️
              </motion.div>
              <h2 className="text-lg font-bold text-white mb-2">
                Did you face an urge?
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Log your result honestly.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Resisted */}
                <motion.button
                  onClick={() => handleChoice("won")}
                  disabled={loading}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  className="py-4 bg-neon-green/15 border border-neon-green/50 rounded-xl font-bold text-neon-green flex flex-col items-center gap-1 disabled:opacity-50"
                >
                  <span className="text-2xl">💪</span>
                  <span className="text-sm">I resisted</span>
                  <span className="text-[10px] font-mono opacity-70">+10 XP · streak +1</span>
                </motion.button>

                {/* Gave in */}
                <motion.button
                  onClick={() => handleChoice("lost")}
                  disabled={loading}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,68,68,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  className="py-4 bg-neon-red/15 border border-neon-red/50 rounded-xl font-bold text-neon-red flex flex-col items-center gap-1 disabled:opacity-50"
                >
                  <span className="text-2xl">😔</span>
                  <span className="text-sm">I gave in</span>
                  <span className="text-[10px] font-mono opacity-70">streak resets</span>
                </motion.button>
              </div>
            </Card>

            {/* Info */}
            <Card className="text-center">
              <p className="text-gray-500 text-xs">
                You can update today&apos;s entry if you log again.
              </p>
            </Card>
          </motion.div>
        )}

        {/* ── Result ─────────────────────────────────── */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Card
              glow={outcome === "won" ? "green" : "red"}
              className="text-center py-10"
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                {outcome === "won" ? "🏆" : "💔"}
              </motion.div>

              <h2 className="text-xl font-bold font-mono text-white mb-2">
                {outcome === "won" ? "RESISTED" : "NOTED"}
              </h2>

              <motion.p
                className={`text-2xl font-bold font-mono mb-2 ${
                  outcome === "won" ? "text-neon-green" : "text-gray-500"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {outcome === "won" ? "+10 XP · streak +1" : "streak reset"}
              </motion.p>

              <p className="text-gray-400 text-sm mb-8">
                {outcome === "won"
                  ? "Discipline forged. Keep going."
                  : "Every warrior falls. Rise again tomorrow."}
              </p>

              <motion.button
                onClick={reset}
                whileHover={{ borderColor: "rgba(79,159,255,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-shadow-muted border border-shadow-border rounded-xl text-gray-300 font-medium transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Return to Base
              </motion.button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}