import MobileDrawer from "@/components/common/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/common/drawers/notifications-drawer";
import UserPopper from "@/components/common/poppers/user-popper";
import Nav from "@/components/header/nav";
import Logo from "@/components/logo";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { View } from "@/types/view.type";
import { type FunctionComponent } from "react";

const Header: FunctionComponent = async () => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  return (
    <>
      <div className="flex p-4 items-center shadow-lg fixed inset-x-0 top-0 bg-white z-[99]">
        <Logo />
        {(["Student", "Teacher"] as View[]).includes(
          user.user_metadata.role
        ) && (
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
