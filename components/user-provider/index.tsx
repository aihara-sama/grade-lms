"use client";

import GuestPrompt from "@/components/live-lesson/guest-prompt";
import { UserContext } from "@/contexts/user-context";
import { createUserStore } from "@/stores/user-store";
import type { User } from "@/types/user.type";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useRef, useState } from "react";

interface Props {
  user: User | null;
}

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  user: initUser,
  children,
}) => {
  // Hooks
  const store = useRef(createUserStore(initUser)).current;

  const [user, setUser] = useState(initUser);
  store.subscribe((state) => setUser(state.user));

  if (!user)
    return (
      <UserContext.Provider value={store}>
        <GuestPrompt />
      </UserContext.Provider>
    );

  // View
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export default UserProvider;
