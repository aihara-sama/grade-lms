"use client";

import MobileDrawer from "@/components/common/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/common/drawers/notifications-drawer";
import UserPopper from "@/components/common/poppers/user-popper";
import Nav from "@/components/header/nav";
import Logo from "@/components/logo";
import { useUser } from "@/hooks/use-user";
import type { View } from "@/types/view.type";
import { type FunctionComponent } from "react";

const Header: FunctionComponent = () => {
  // Hooks
  const user = useUser((state) => state.user);

  // View
  return (
    <>
      <div className="flex p-4 items-center shadow-lg fixed inset-x-0 top-0 bg-white z-[99]">
        <Logo />
        {(["Student", "Teacher"] as View[]).includes(user.role) && (
          <>
            <Nav className="mr-auto" />
            <NotificationsDrawer className="ml-auto" />
            <UserPopper className="ml-2" />
          </>
        )}
        <MobileDrawer />
      </div>
      <div className="h-[68px]"></div>
    </>
  );
};

export default Header;
