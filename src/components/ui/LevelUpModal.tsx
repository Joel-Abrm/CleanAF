"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", damping: 12 }}
          >
            {/* Glow ring */}
            <motion.div
              className="w-48 h-48 rounded-full mx-auto flex flex-col items-center justify-center relative"
              style={{
                background: "radial-gradient(circle, rgba(155,111,255,0.3) 0%, transparent 70%)",
                boxShadow: "0 0 60px rgba(155,111,255,0.6), 0 0 120px rgba(79,159,255,0.3)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ rotate: i * 45 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                >
                  <Star size={16} className="text-neon-gold" style={{ transform: "translateY(-80px)" }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-neon-gold font-display text-2xl font-bold tracking-widest">
                LEVEL UP!
              </div>
              <div className="text-white font-mono text-6xl font-bold my-2">{level}</div>
              <div className="text-gray-400 text-sm">Your power grows, Hunter</div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-neon-purple/20 border border-neon-purple/50 rounded-lg text-neon-purple text-sm font-mono hover:bg-neon-purple/30 transition-colors"
              >
                CONTINUE
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
