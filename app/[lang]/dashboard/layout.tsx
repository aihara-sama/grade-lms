import Header from "@/components/header";
import PushNotificationsProvider from "@/components/push-notifications-provider";
import UserProvider from "@/components/user-provider";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  return (
    <div className="h-full flex-col">
      <UserProvider user={user}>
        <PushNotificationsProvider />
        <Header />
        {children}
      </UserProvider>
    </div>
  );
};

export default Layout;
