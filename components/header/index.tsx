"use client";

import MobileDrawer from "@/components/common/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/common/drawers/notifications-drawer";
import UserPopper from "@/components/common/poppers/user-popper";
import Nav from "@/components/header/nav";
import Logo from "@/components/logo";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { messaging } from "@/utils/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect, type FunctionComponent } from "react";

interface Props {}

const Header: FunctionComponent<Props> = () => {
  const { user } = useUser();

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
    <div className="flex p-4 items-center shadow-lg fixed inset-x-0 top-0 bg-white z-[99]">
      <Logo />
      {[Role.Teacher, Role.Student].includes(user.role as Role) && (
        <>
          <Nav className="mr-auto" />
          <NotificationsDrawer />
          <UserPopper className="ml-2" />
        </>
      )}
      <MobileDrawer />
    </div>
  );
};

export default Header;
