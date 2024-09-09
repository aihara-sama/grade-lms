"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Notification from "@/components/common/drawers/notifications-drawer/notification";
import NotificationsIcon from "@/components/icons/notifications-icon";
import Skeleton from "@/components/skeleton";
import { NOTIFICATIONS_GET_LIMIT } from "@/constants";
import { getNotifications } from "@/db/notification";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types";
import { Event } from "@/types/events.type";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle-fetch";
import type { FunctionComponent, UIEventHandler } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  className?: string;
}

const NotificationsDrawer: FunctionComponent<Props> = ({ className }) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [notifications, setNotifications] = useState<
    ResultOf<typeof getNotifications>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hooks
  const notificationChannel = useNotificationChannel();
  const { user } = useUser();

  // Refs
  const notificationsOffsetRef = useRef(0);

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
  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await getNotifications(
        user.id,
        notificationsOffsetRef.current,
        notificationsOffsetRef.current + NOTIFICATIONS_GET_LIMIT - 1
      );
      setNotifications((prev) => [...prev, ...fetchedNotifications]);
      notificationsOffsetRef.current += fetchedNotifications.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchNotifications), []);

  const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (isCloseToBottom(e.target as HTMLElement)) onScrollEnd();
  };

  // Effects
  useEffect(() => {
    notificationChannel
      .on("broadcast", { event: Event.NotificationCreated }, onNewNotification)
      .subscribe();
  }, []);

  useEffect(() => {
    (async () => {
      if (isOpen) {
        setIsLoading(true);
        await fetchNotifications();
        setIsLoading(false);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    setIsNewNotification(notifications.some(({ is_read }) => !is_read));
  }, [notifications]);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`icon-button relative ${className}`}
      >
        <NotificationsIcon size="sm" />
        {isNewNotification && (
          <div className="absolute right-[7px] top-[7px] w-[10px] h-[10px] bg-red-500 rounded-[50%] border border-white"></div>
        )}
      </button>

      {isOpen && (
        <BaseDrawer
          onClose={() => setIsOpen(false)}
          placement="right"
          header={
            <div className="text-center flex-1 text-md font-bold">
              Notifications
            </div>
          }
        >
          {isLoading && <Skeleton className="px-4 pt-4" />}
          {!isLoading && (
            <div
              onScroll={onScroll}
              className="max-h-[calc(100vh-88px)] overflow-auto py-4"
            >
              {notifications.map((notification) => (
                <Notification
                  notification={notification}
                  onNavigateAway={() => setIsOpen(false)}
                  onReadNotification={() => onReadNotification(notification.id)}
                  key={notification.id}
                />
              ))}
            </div>
          )}
        </BaseDrawer>
      )}
    </>
  );
};

export default NotificationsDrawer;
