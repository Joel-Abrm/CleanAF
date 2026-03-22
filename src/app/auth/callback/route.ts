import { createClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/actions";
import { NextResponse } from "next/server";

// OAuth callback handler
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await upsertUserProfile(data.user.id, data.user.email!);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
