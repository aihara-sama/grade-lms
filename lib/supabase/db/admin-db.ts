import { Database } from "@/types/supabase.type";
import { createClient } from "@supabase/supabase-js";

export const adminDB = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
