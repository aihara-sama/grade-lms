import { createBrowserClient } from "npm:@supabase/ssr";

export const db = createBrowserClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON_KEY")
);
