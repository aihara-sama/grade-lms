import { Database } from "@/types/supabase.type";
import { createBrowserClient } from "@supabase/ssr";

export const browserDB = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
