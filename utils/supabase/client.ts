import type { Database } from "@/types/supabase.type";
import { createBrowserClient } from "@supabase/ssr";

export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
