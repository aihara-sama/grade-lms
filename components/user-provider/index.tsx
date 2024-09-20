"use client";

import GuestPrompt from "@/components/live-lesson/guest-prompt";
import { useUser } from "@/hooks/use-user";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { browserDB } from "@/lib/supabase/db/browser-db";
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
        avatar: (user.user_metadata as IUserMetadata).avatar,
        created_at: user.created_at,
        creator_id: (user.user_metadata as IUserMetadata).creator_id,
        email: user.email,
        name: (user.user_metadata as IUserMetadata).name,
        role: (user.user_metadata as IUserMetadata).role,
        preferred_locale: (user.user_metadata as IUserMetadata)
          .preferred_locale,
        timezone: (user.user_metadata as IUserMetadata).timezone,
        is_emails_on: (user.user_metadata as IUserMetadata).is_emails_on,
        is_push_notifications_on: (user.user_metadata as IUserMetadata)
          .is_push_notifications_on,
      });

    browserDB.auth.onAuthStateChange((event) => {
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
