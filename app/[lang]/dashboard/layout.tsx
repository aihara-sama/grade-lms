import Header from "@/components/header";
import PushNotificationsProvider from "@/components/push-notifications-provider";
import UserProvider from "@/components/user-provider";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { polishUser } from "@/utils/user/polish-user";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  return (
    <UserProvider user={polishUser(user)}>
      <PushNotificationsProvider />
      <Header />
      <div className="overflow-auto flex flex-col flex-1">{children}</div>
    </UserProvider>
  );
};

export default Layout;
