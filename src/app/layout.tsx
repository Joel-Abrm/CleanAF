import type { Metadata } from "next";
import { Rajdhani, Orbitron, Cinzel } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-orbitron",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "ShadowRise — Gamified Habit Tracker",
  description: "Level up your life. Track habits, resist urges, become unstoppable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable} ${cinzel.variable}`}>
      <body className="bg-shadow-bg font-sans antialiased">{children}</body>
    </html>
  );
}
