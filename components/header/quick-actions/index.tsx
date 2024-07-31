"use client";

import MessagesIcon from "@/components/icons/messages-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import type { FunctionComponent } from "react";

interface IProps {}

const QuickActions: FunctionComponent<IProps> = () => {
  return (
    <div className="flex gap-[4px] items-center ml-auto">
      <button className="icon-button hover:bg-gray-100 active:bg-gray-200">
        <MessagesIcon />
      </button>
      <button className="icon-button hover:bg-gray-100 active:bg-gray-200">
        <NotificationsIcon />
      </button>
    </div>
  );
};

export default QuickActions;
