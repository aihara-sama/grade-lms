import type { Locale } from "@/i18n";

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
  creator_id?: string;
  timezone: string;
  is_push_notifications_on: boolean;
  is_emails_on: boolean;
}
