"use client";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import GuestPrompt from "@/components/common/prompts/guest-prompt";
import { UserContext } from "@/contexts/user-context";
import { DB } from "@/lib/supabase/db";
import { createUserStore } from "@/stores/user-store";
import type { User } from "@/types/user.type";
import { useRouter } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  user: User | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  user: initUser,
  children,
}) => {
  // Hooks
  const router = useRouter();
  const store = useRef(createUserStore(initUser)).current;

  const [user, setUser] = useState(initUser);
  store.subscribe((state) => setUser(state.user));

  // Effects
  useEffect(() => {
    DB.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        store.setState({ user: undefined });

        revalidatePageAction();
        router.push(`/sign-in`);
      }
    });
  }, []);

  if (user === undefined) return null;
  if (user === null)
    return (
      <UserContext.Provider value={store}>
        <GuestPrompt />
      </UserContext.Provider>
    );

  // View
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export default UserProvider;
