"use client";

import GuestPrompt from "@/components/live-lesson/guest-prompt";
import { UserContext } from "@/contexts/user-context";
import { DB } from "@/lib/supabase/db";
import { createUserStore } from "@/stores/user-store";
import type { User } from "@/types/user.type";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

interface Props {
  user: User | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  user,
  children,
}) => {
  // Hooks
  const store = useRef(createUserStore(user)).current;

  // Effects
  useEffect(() => {
    DB.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") store.setState({ user: null });
    });
  }, []);

  if (!user) return <GuestPrompt />;

  // View
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export default UserProvider;
