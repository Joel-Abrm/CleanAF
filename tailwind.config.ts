import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shadow: {
          bg: "#080C14",
          card: "#0D1220",
          border: "#1A2540",
          muted: "#1E2D4A",
        },
        neon: {
          blue: "#4F9FFF",
          purple: "#9B6FFF",
          cyan: "#00E5FF",
          green: "#00FF88",
          red: "#FF4444",
          gold: "#FFB800",
        },
        stat: {
          strength: "#FF6B35",
          intelligence: "#9B6FFF",
          discipline: "#4F9FFF",
          willpower: "#00E5FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-orbitron)", "monospace"],
        display: ["var(--font-cinzel)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glow-blue": "radial-gradient(ellipse at center, rgba(79,159,255,0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(ellipse at center, rgba(155,111,255,0.15) 0%, transparent 70%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float-up": "floatUp 1s ease-out forwards",
        "level-up": "levelUp 0.5s ease-out forwards",
        "xp-fill": "xpFill 1s ease-out forwards",
        "screen-flash": "screenFlash 0.4s ease-out forwards",
        "particle-burst": "particleBurst 0.8s ease-out forwards",
        "shake": "shake 0.4s ease-in-out",
        "streak-pulse": "streakPulse 1s ease-in-out",
        "xp-bar-flash": "xpBarFlash 0.6s ease-out forwards",
        "scanline": "scanline 3s linear infinite",
        "glow-ring": "glowRing 1.5s ease-out forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(79,159,255,0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(79,159,255,0.8)" },
        },
        floatUp: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "20%": { opacity: "1", transform: "translateY(-10px) scale(1.1)" },
          "100%": { opacity: "0", transform: "translateY(-80px) scale(0.8)" },
        },
        levelUp: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        xpFill: {
          "0%": { width: "0%" },
        },
        screenFlash: {
          "0%": { opacity: "0" },
          "20%": { opacity: "0.3" },
          "100%": { opacity: "0" },
        },
        particleBurst: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "60%": { transform: "scale(1.5)", opacity: "0.6" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
        streakPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        xpBarFlash: {
          "0%": { opacity: "0", transform: "scaleX(0)" },
          "30%": { opacity: "1" },
          "100%": { opacity: "0", transform: "scaleX(1)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glowRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(79,159,255,0.4)",
        "glow-purple": "0 0 20px rgba(155,111,255,0.4)",
        "glow-green": "0 0 20px rgba(0,255,136,0.4)",
        "glow-red": "0 0 20px rgba(255,68,68,0.4)",
        "glow-gold": "0 0 20px rgba(255,184,0,0.4)",
        "card": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
