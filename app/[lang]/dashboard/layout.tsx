import PushNotificationsProvider from "@/components/providers/push-notifications-provider";
import UserProvider from "@/components/providers/user-provider";
import { getProfile } from "@/db/server/user";
import { parseUser } from "@/utils/user/parse-user";
import Header from "@editorjs/header";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getProfile();

  return (
    <UserProvider user={parseUser(user)}>
      <PushNotificationsProvider />
      <Header />
      <div className="overflow-auto flex flex-col flex-1">{children}</div>
    </UserProvider>
  );
};

export default Layout;
