import { createBrowserClient } from "npm:@supabase/ssr";

export const adminDB = createBrowserClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);
