import Header from "@/components/layout/header";
import PushNotificationsProvider from "@/components/providers/push-notifications-provider";
import UserProvider from "@/components/providers/user-provider";
import { getCachedUser, getProfile } from "@/db/server/user";
import type { ResultOf } from "@/types/utils.type";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const {
    data: { user },
  } = await getCachedUser();

  let profile: ResultOf<typeof getProfile> | null = null;

  if (user) {
    profile = await getProfile(user.id);
  }

  return (
    <UserProvider profile={profile}>
      <PushNotificationsProvider />
      <Header />
      <div className="overflow-auto flex flex-col flex-1">{children}</div>
    </UserProvider>
  );
};

export default Layout;

export const revalidate = 0;
