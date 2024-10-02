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
    is_push_notifications_on: boolean;
    is_emails_on: boolean;
  }
}