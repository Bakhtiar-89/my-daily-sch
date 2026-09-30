import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDatabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Pull this project's Vercel environment variables and reload.",
    );
  }
  return createSupabaseServerClient();
}
