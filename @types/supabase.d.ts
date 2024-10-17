import type { Database } from "@/types/supabase.type";

export declare module "@supabase/auth-js" {
  interface UserMetadata {
    name: string;
    role: Database["public"]["Enums"]["role"];
    avatar: string;
    email: string;
    preferred_locale: Locale;
    creator_id?: string;
    timezone: string;
    push_notifications_state: Database["public"]["Enums"]["push_notifications_state"];
    is_emails_on: boolean;
    isPro: boolean;
    role: Database["public"]["Enums"]["role"];
  }
}
