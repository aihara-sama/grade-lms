import type { User } from "@/types/user.type";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const polishUser = (user: SupabaseUser | null): User | null => {
  if (user === null) return null;

  return {
    id: user.id,
    avatar: user.user_metadata.avatar,
    created_at: user.created_at,
    creator_id: user.user_metadata.creator_id,
    email: user.email,
    name: user.user_metadata.name,
    role: user.user_metadata.role,
    preferred_locale: user.user_metadata.preferred_locale,
    timezone: user.user_metadata.timezone,
    is_emails_on: user.user_metadata.is_emails_on,
    push_notifications_state: user.user_metadata.push_notifications_state,
  };
};
