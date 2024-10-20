import type { Database } from "@/types/supabase.type";

export declare module "@supabase/auth-js" {
  interface UserMetadata {
    name: string;
    role: Database["public"]["Enums"]["role"];
    avatar: string;
    preferred_locale: Locale;
    creator_id?: string;
    timezone: string;
  }
}
