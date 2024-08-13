"use client";

import UserPopper from "@/components/common/poppers/user-popper";
import MobileDrawer from "@/components/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/drawers/notifications-drawer";
import Nav from "@/components/header/nav";
import Logo from "@/components/logo";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { messaging } from "@/utils/firebase";
import type { User } from "@supabase/supabase-js";
import { onMessage } from "firebase/messaging";
import { useEffect, type FunctionComponent } from "react";

interface IProps {
  user: User;
}

const Header: FunctionComponent<IProps> = ({ user }) => {
  useEffect(() => {
    onMessage(
      messaging,
      (payload) =>
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        })
    );
  }, []);

  return (
    <div className="flex p-4 items-center shadow-lg">
      <Logo />
      {!!user && (
        <>
          <div className="mr-auto">
            <Nav />
          </div>
          <NotificationsDrawer user={user} />
          <div className="ml-2">
            <UserPopper
              userName={(user.user_metadata as IUserMetadata).name}
              role={(user.user_metadata as IUserMetadata).role}
              avatar={(user.user_metadata as IUserMetadata).avatar}
            />
          </div>
          <MobileDrawer />
        </>
      )}
    </div>
  );
};

export default Header;
