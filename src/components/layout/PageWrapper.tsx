"use client";

import { motion } from "framer-motion";
import { Navbar } from "./Navbar";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-shadow-bg text-white">
      {/* Atmospheric background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-neon-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[100px]" />
      </div>

      <motion.main
        className="relative max-w-md mx-auto px-4 pt-6 pb-24"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      <Navbar />
    </div>
  );
}
