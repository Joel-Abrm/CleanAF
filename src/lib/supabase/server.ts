import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Define the type for a cookie
type Cookie = {
  name: string;
  value: string;
  options?: { [key: string]: any }; // You can narrow this if you know the exact shape
};

// Server-side Supabase client (for Server Components / Route Handlers)
export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Cookie[]) { // <-- explicitly typed
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from Server Component — safe to ignore
          }
        },
      },
    }
  );
};