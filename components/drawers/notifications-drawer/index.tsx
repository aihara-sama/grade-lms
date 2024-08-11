"use client";

import CloseIcon from "@/components/icons/close-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { ROLES } from "@/interfaces/user.interface";
import { getNotificationChannel } from "@/utils/get-notification-channel";
import { parseNotification } from "@/utils/parse-notification";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import clsx from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

const NotificationsDrawer: FunctionComponent<Props> = ({ user }) => {
  const [notifications, setNotifications] = useState<
    {
      is_read: boolean;
      id: string;
      created_at: string;
      type: string;
      course: {
        title: string;
        id: string;
      };
      lesson: {
        title: string;
        id: string;
      };
      assignment: {
        title: string;
      };
      user: {
        name: string;
      };
    }[]
  >([]);

  const [isNewNotification, setIsNewNotification] = useState(false);

  const getNotifications = async () => {
    const data = await supabaseClient
      .from("notifications")
      .select(
        "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)"
      )
      .eq("users.id", user.id);

    setNotifications(data.data);
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const room =
      (user.user_metadata as IUserMetadata).role === ROLES.TEACHER
        ? user.id
        : (user.user_metadata as IUserMetadata).creator_id;

    getNotificationChannel(room)
      .on("broadcast", { event: "notification" }, () => {
        setIsNewNotification(true);
      })
      .subscribe();
  }, []);

  const readNotification = async (notificationId: string) => {
    const { error } = await supabaseClient
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      toast.error("Something went wrong");
    } else {
      setNotifications((prev) =>
        prev.map((_) => {
          if (_.id === notificationId) _.is_read = true;
          return _;
        })
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      getNotifications();
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsNewNotification(notifications.some(({ is_read }) => !is_read));
  }, [notifications]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 backdrop-filter backdrop-blur-[2px] z-[99] bg-mask"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="icon-button relative"
      >
        <NotificationsIcon size="sm" />
        {isNewNotification && (
          <div className="absolute right-[7px] top-[7px] w-[10px] h-[10px] bg-red-500 rounded-[50%] border border-white"></div>
        )}
      </button>

      {/* Actual Drawer */}
      <div
        className={clsx(
          "z-[999] bg-white transition-[0.4s] duration-[right] absolute inset-y-0 -right-full w-[450px]",
          { "right-0": isOpen }
        )}
      >
        <div className="shadow-lg py-4 px-7">
          <div className="flex items-center">
            <div className="text-center flex-1 text-md font-bold">
              Notifications
            </div>
            <button onClick={() => setIsOpen(false)} className="icon-button">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="max-h-[calc(100vh-88px)] overflow-auto py-4">
          {notifications.map((notification) => {
            const { href, body, textHref, title } =
              parseNotification(notification);
            return (
              <div
                onMouseEnter={() => {
                  if (!notification.is_read) readNotification(notification.id);
                }}
                key={notification.id}
                className="flex flex-col pb-4 px-7 "
              >
                <div className="flex items-start gap-2">
                  <button className="relative icon-button border border-neutral-300">
                    <NotificationsIcon className="" size="xs" />
                    <div
                      className={`absolute bottom-[-18px] w-[10px] h-[10px]  rounded-[50%] border border-white ${!notification.is_read ? "bg-red-500" : "bg-transparent"} transition-all`}
                    ></div>
                  </button>
                  <div>
                    <p className="text-neutral-700 text-[15px] font-bold">
                      {title}
                    </p>
                    <p className="">{body}</p>
                    <p className="text-sm text-neutral-500 mb-2">
                      {formatDistanceToNowStrict(
                        new Date(notification.created_at)
                      )}
                    </p>
                    <Link
                      href={href}
                      className="text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {textHref}
                    </Link>
                  </div>
                </div>
                <hr className="mt-4" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
