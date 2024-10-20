import UserProvider from "@/components/providers/user-provider";
import { getProfile } from "@/db/server/user";
import { parseUser } from "@/utils/user/parse-user";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getProfile();

  return <UserProvider user={parseUser(user)}>{children}</UserProvider>;
};

export default Layout;
