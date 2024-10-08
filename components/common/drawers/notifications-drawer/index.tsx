"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Notification from "@/components/common/drawers/notifications-drawer/notification";
import NotificationsIcon from "@/components/icons/notifications-icon";
import Skeleton from "@/components/skeleton";
import { NOTIFICATIONS_GET_LIMIT } from "@/constants";
import {
  getNewNotifications,
  getNotification,
  getNotifications,
} from "@/db/client/notification";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { ResultOf } from "@/types/utils.type";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import type { FunctionComponent, UIEventHandler } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

interface Props {
  className?: string;
}

const NotificationsDrawer: FunctionComponent<Props> = ({ className }) => {
  // Hooks
  const user = useUser((state) => state.user);
  const { firePushNotification } = usePushNotifications();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const [notifications, setNotifications] = useState<
    ResultOf<typeof getNotifications>["data"]
  >([]);

  const isNewNotifications = newNotificationsCount !== 0;

  // Refs
  const notificationsOffsetRef = useRef(0);

  // Handlers
  const onReadNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );

    setNewNotificationsCount((prev) => prev - 1);
  };
  const fetchNotifications = async () => {
    try {
      const [fetchedNotifications, fetchedNewNotifications] = await Promise.all(
        [
          getNotifications(
            notificationsOffsetRef.current,
            notificationsOffsetRef.current + NOTIFICATIONS_GET_LIMIT - 1
          ),
          getNewNotifications({ head: true }),
        ]
      );

      setNewNotificationsCount(fetchedNewNotifications.count);
      setNotifications((prev) => [...prev, ...fetchedNotifications.data]);

      notificationsOffsetRef.current += fetchedNotifications.data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onScrollEnd = useCallback(throttleFetch(fetchNotifications), []);

  const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (isCloseToBottom(e.target as HTMLElement)) onScrollEnd();
  };

  const onNewNotification = async (
    payload: RealtimePostgresInsertPayload<(typeof notifications)[number]>
  ) => {
    try {
      const data = await getNotification(payload.new.id);

      setNotifications((prev) => [data, ...prev]);
      setNewNotificationsCount((prev) => prev + 1);

      notificationsOffsetRef.current += 1;

      if (user.push_notifications_state === "On") firePushNotification(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    DB.channel("changes")
      .on<(typeof notifications)[number]>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        onNewNotification
      )
      .subscribe();
  }, [user]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchNotifications();
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`icon-button relative ${className}`}
      >
        <NotificationsIcon size="sm" />
        {isNewNotifications && (
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
