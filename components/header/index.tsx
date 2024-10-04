"use client";

import Alert from "@/components/alert";
import MobileDrawer from "@/components/common/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/common/drawers/notifications-drawer";
import UserPopper from "@/components/common/poppers/user-popper";
import Nav from "@/components/header/nav";
import NotificationsIcon from "@/components/icons/notifications-icon";
import Logo from "@/components/logo";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { View } from "@/types/view.type";
import type { UserMetadata } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Header: FunctionComponent = () => {
  // Hooks
  const { enablePushNotifications } = usePushNotifications();
  const { user, setUser } = useUser((state) => state);
  const t = useTranslations();

  const disablePushNotifications = async () => {
    try {
      const { error } = await DB.auth.updateUser({
        data: {
          push_notifications_state: "Off",
        } as UserMetadata,
      });

      setUser({ ...user, push_notifications_state: "Off" });
      if (error) throw new Error(t("error.failed_to_update_user"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[99]">
        {user.push_notifications_state === "Idle" && (
          <Alert onClose={disablePushNotifications}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <NotificationsIcon size="xs" />
                <p className="text-sm font-bold">
                  Do you want to enable browser notifications?
                </p>
              </div>
              <button
                onClick={enablePushNotifications}
                className="rounded border border-dark-200 inter-active cursor-pointer px-4 py-1 text-sm"
              >
                Enable
              </button>
            </div>
          </Alert>
        )}
        <div className="flex p-4 items-center shadow-lg bg-white ">
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
      </div>
      <div
        className={`${user.push_notifications_state === "Idle" ? "h-[114px]" : "h-[68px]"}`}
      ></div>
    </>
  );
};

export default Header;
