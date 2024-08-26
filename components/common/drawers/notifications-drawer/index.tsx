"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Notification from "@/components/common/drawers/notifications-drawer/notification";
import NotificationsIcon from "@/components/icons/notifications-icon";
import { getNotifications } from "@/db/notification";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { ResultOf } from "@/types";
import { Event } from "@/types/events.type";
import {
  closeNotificationChannel,
  getNotificationChannel,
} from "@/utils/get-notification-channel";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const NotificationsDrawer: FunctionComponent = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [notifications, setNotifications] = useState<
    ResultOf<typeof getNotifications>
  >([]);

  // Hooks
  const { user } = useUser();

  // Handlers
  const onNewNotification = () => setIsNewNotification(true);
  const onReadNotification = (notificationId: string) =>
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
  const handleGetNotifications = async () => {
    try {
      setNotifications(await getNotifications(user.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    const room = user.role === Role.Teacher ? user.id : user.creator_id;

    getNotificationChannel(room)
      .on("broadcast", { event: Event.NewNotification }, onNewNotification)
      .subscribe();

    return () => {
      closeNotificationChannel();
    };
  }, []);

  useEffect(() => {
    if (isOpen) handleGetNotifications();
  }, [isOpen]);

  useEffect(() => {
    setIsNewNotification(notifications.some(({ is_read }) => !is_read));
  }, [notifications]);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="icon-button relative"
      >
        <NotificationsIcon size="sm" />
        {isNewNotification && (
          <div className="absolute right-[7px] top-[7px] w-[10px] h-[10px] bg-red-500 rounded-[50%] border border-white"></div>
        )}
      </button>

      <BaseDrawer
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        placement="right"
        header={
          <div className="text-center flex-1 text-md font-bold">
            Notifications
          </div>
        }
      >
        <div className="max-h-[calc(100vh-88px)] overflow-auto py-4">
          {notifications.map((notification) => (
            <Notification
              notification={notification}
              onNavigateAway={() => setIsOpen(false)}
              onReadNotification={() => onReadNotification(notification.id)}
              key={notification.id}
            />
          ))}
        </div>
      </BaseDrawer>
    </>
  );
};

export default NotificationsDrawer;
