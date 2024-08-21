import type en from "@/public/messages/en.json";
import type { UserMetadata } from "@supabase/supabase-js";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
interface CustomUserMetadata extends UserMetadata {
  name: string;
  role: ROLES;
  avatar: string;
  email: string;
  preferred_locale: Locale;
  /**
   * Push Notifications Token
   */
  fcm_token?: string;
  creator_id?: string;
}
