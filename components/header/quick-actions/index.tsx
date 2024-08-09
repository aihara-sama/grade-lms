"use client";

import NotificationsIcon from "@/components/icons/notifications-icon";
import type { FunctionComponent } from "react";

interface IProps {}

const QuickActions: FunctionComponent<IProps> = () => {
  return (
    <div className="flex gap-[4px] items-center ml-auto">
      <button className="icon-button text-neutral-600">
        <NotificationsIcon />
      </button>
    </div>
  );
};

export default QuickActions;
