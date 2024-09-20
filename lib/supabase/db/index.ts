import { Database } from "@/types/supabase.type";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const DB = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const adminDB = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
