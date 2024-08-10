"use client";

import NotificationsDrawer from "@/components/drawers/notifications-drawer";
import type { User } from "@supabase/supabase-js";
import type { FunctionComponent } from "react";

interface IProps {
  user: User;
}

const QuickActions: FunctionComponent<IProps> = ({ user }) => {
  return (
    <div className="flex gap-[4px] items-center ml-auto">
      <NotificationsDrawer user={user} />
    </div>
  );
};

export default QuickActions;
