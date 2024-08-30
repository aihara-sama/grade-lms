"use client";

import GuestPrompt from "@/components/live-lesson/user-name-prompt";
import { useUser } from "@/hooks/use-user";
import type { IUserMetadata } from "@/interfaces/user.interface";
import type { User } from "@supabase/supabase-js";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect } from "react";

interface IProps {
  user: User | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<IProps>> = ({
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
        fcm_token: null,
        timezone: (user.user_metadata as IUserMetadata).timezone,
      });
  }, []);

  // View
  if (userStore.user === null) return null;
  if (userStore.user === undefined) return <GuestPrompt />;

  // View
  return <>{children}</>;
};

export default UserProvider;