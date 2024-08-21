import type { Locale } from "@/i18n";

export enum ROLES {
  STUDENT = "Student",
  TEACHER = "Teacher",
  GUEST = "Guest",
}

export interface IUserMetadata {
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
