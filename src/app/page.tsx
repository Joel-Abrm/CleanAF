import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Root page — redirect based on auth state
export default async function RootPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
