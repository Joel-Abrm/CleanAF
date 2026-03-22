import { Navbar } from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-shadow-bg">
      {children}
      <Navbar />
    </div>
  );
}
