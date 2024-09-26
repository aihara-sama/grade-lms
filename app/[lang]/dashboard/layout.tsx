import Header from "@/components/header";
import PushNotificationsProvider from "@/components/push-notifications-provider";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  return (
    <div className="h-full">
      <PushNotificationsProvider />
      <Header />
      {children}
    </div>
  );
};

export default Layout;
