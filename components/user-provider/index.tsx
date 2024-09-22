"use client";

import GuestPrompt from "@/components/live-lesson/guest-prompt";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { User } from "@supabase/supabase-js";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect } from "react";

interface Props {
  user: User | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  user,
  children,
}) => {
  // Hooks
  const userStore = useUser();

  // Effects
  useEffect(() => {
    if (user === null) userStore.setUser(undefined);
    else if (user)
      userStore.setUser({
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
        is_push_notifications_on: user.user_metadata.is_push_notifications_on,
      });

    DB.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") userStore.setUser(null);
    });
  }, []);

  // View
  if (userStore.user === null) return null;
  if (userStore.user === undefined) return <GuestPrompt />;

  // View
  return <>{children}</>;
};

export default UserProvider;
