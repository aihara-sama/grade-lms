import type { Locale } from "@/i18n";
import type { User } from "@supabase/supabase-js";

export enum Role {
  Teacher = "Teacher",
  Student = "Student",
  Guest = "Guest",
}

export interface IUserMetadata {
  name: string;
  role: Role;
  avatar: string;
  email: string;
  preferred_locale: Locale;
  /**
   * Push Notifications Token
   */
  fcm_token?: string;
  creator_id?: string;
}

export interface AuthUser extends User {
  user_metadata: IUserMetadata;
}
