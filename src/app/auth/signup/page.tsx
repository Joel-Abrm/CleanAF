"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { upsertUserProfile } from "@/lib/actions";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup() {
    if (!email || !password) return;
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create user profile in our users table
      await upsertUserProfile(data.user.id, email);
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-shadow-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neon-purple/5 blur-[150px]" />
      </div>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <p className="text-neon-purple font-mono text-sm tracking-[0.3em] uppercase">
            Initiate System
          </p>
          <h1 className="text-3xl font-bold text-white mt-2">You have been selected</h1>
        </div>

        <div className="bg-shadow-card border border-shadow-border rounded-2xl p-6 shadow-card">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neon-red text-sm mb-4 text-center bg-neon-red/10 rounded-xl px-3 py-2 border border-neon-red/20"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          <motion.button
            onClick={handleSignup}
            disabled={loading}
            whileHover={{ boxShadow: "0 0 30px rgba(155,111,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-5 py-3 rounded-xl font-bold text-sm tracking-wider bg-gradient-to-r from-neon-purple to-neon-blue text-white disabled:opacity-50 transition-all"
          >
            {loading ? "Awakening..." : "Begin Awakening ✦"}
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already a Hunter?{" "}
            <Link href="/auth/login" className="text-neon-blue hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
