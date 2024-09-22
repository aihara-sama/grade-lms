export declare module "@supabase/auth-js" {
  interface UserMetadata {
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
}
