"use client";

import GuestPrompt from "@/components/common/prompts/guest-prompt";
import { UserContext } from "@/contexts/user-context";
import type { getProfile } from "@/db/server/user";
import { DB } from "@/lib/supabase/db";
import { createUserStore } from "@/stores/user-store";
import type { ResultOf } from "@/types/utils.type";
import { useRouter } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  profile: ResultOf<typeof getProfile> | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  profile: initProfile,
  children,
}) => {
  // Hooks
  const store = useRef(createUserStore(initProfile)).current;
  const router = useRouter();

  const [user, setUser] = useState(initProfile);
  store.subscribe((state) => setUser(state.user));

  // Effects
  useEffect(() => {
    DB.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        store.setState({ user: undefined });
        router.push("/sign-in");
        router.refresh();
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
