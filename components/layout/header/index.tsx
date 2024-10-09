"use client";

import Alert from "@/components/common/alert";
import MobileDrawer from "@/components/common/drawers/mobile-drawer";
import NotificationsDrawer from "@/components/common/drawers/notifications-drawer";
import Logo from "@/components/common/logo";
import UserPopper from "@/components/common/poppers/user-popper";
import NotificationsIcon from "@/components/icons/notifications-icon";
import Nav from "@/components/layout/header/nav";
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
  const t = useTranslations();
  const { user, setUser } = useUser((state) => state);
  const { enablePushNotifications } = usePushNotifications();

  const disablePushNotifications = async () => {
    try {
      const { error } = await DB.auth.updateUser({
        data: {
          push_notifications_state: "off",
        } as UserMetadata,
      });

      setUser({ ...user, push_notifications_state: "off" });
      if (error) throw new Error(t("error.failed_to_update_user"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[99]">
        {user.push_notifications_state === "idle" && (
          <Alert onClose={disablePushNotifications}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <NotificationsIcon size="xs" />
                <p className="text-sm font-bold flex-1">
                  {t("dashboard.header.enable_browser_notifications")}
                </p>
              </div>
              <button
                onClick={enablePushNotifications}
                className="rounded border border-dark-200 inter-active cursor-pointer px-4 py-1 text-sm"
              >
                {t("dashboard.header.enable")}
              </button>
            </div>
          </Alert>
        )}
        <div className="flex p-4 items-center shadow-lg bg-white ">
          <Logo />
          {(["student", "teacher"] as View[]).includes(user.role) && (
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
        className={`${user.push_notifications_state === "idle" ? "h-[114px]" : "h-[68px]"}`}
      ></div>
    </>
  );
};

export default Header;
