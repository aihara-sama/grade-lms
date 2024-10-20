import UserProvider from "@/components/providers/user-provider";
import { getCachedUser, getProfile } from "@/db/server/user";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user: profile },
  } = await getCachedUser();

  const user = await getProfile(profile.id);

  return <UserProvider profile={user}>{children}</UserProvider>;
};

export default Layout;
