"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
  if (!email || !password) return;
  setLoading(true);
  setError("");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      // Wait for cookies to be written before navigating
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
  } catch (e) {
    setError("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
}

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-shadow-bg flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neon-blue/5 blur-[150px]" />
      </div>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-neon-blue/30 bg-neon-blue/10"
            animate={{ boxShadow: ["0 0 20px rgba(79,159,255,0.3)", "0 0 40px rgba(79,159,255,0.6)", "0 0 20px rgba(79,159,255,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">⚔️</span>
          </motion.div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-wider">
            SHADOW<span className="text-neon-blue">RISE</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">System Initializing...</p>
        </div>

        {/* Form card */}
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
              className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-shadow-muted border border-shadow-border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors pr-11"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            onClick={handleLogin}
            disabled={loading}
            whileHover={{ boxShadow: "0 0 30px rgba(79,159,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-5 py-3 rounded-xl font-bold text-sm tracking-wider bg-gradient-to-r from-neon-blue to-neon-purple text-white disabled:opacity-50 transition-all"
          >
            {loading ? "Initializing..." : "Enter System ⚡"}
          </motion.button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-shadow-border" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-600">
              <span className="bg-shadow-card px-3">or</span>
            </div>
          </div>

          <motion.button
            onClick={handleGoogle}
            whileHover={{ borderColor: "rgba(79,159,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl border border-shadow-border text-sm text-gray-300 flex items-center justify-center gap-2 hover:bg-shadow-muted transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-4">
            New Hunter?{" "}
            <Link href="/auth/signup" className="text-neon-blue hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
