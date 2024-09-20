import type { Role } from "@/enums/role.enum";
import type { Locale } from "@/i18n";

export interface UserMetadata {
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
