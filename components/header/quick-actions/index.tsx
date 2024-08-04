"use client";

import MessagesIcon from "@/components/icons/messages-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import type { FunctionComponent } from "react";

interface IProps {}

const QuickActions: FunctionComponent<IProps> = () => {
  return (
    <div className="flex gap-[4px] items-center ml-auto">
      <button className="icon-button">
        <MessagesIcon />
      </button>
      <button className="icon-button">
        <NotificationsIcon />
      </button>
    </div>
  );
};

export default QuickActions;
