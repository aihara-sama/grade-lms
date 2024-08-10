"use client";

import CloseIcon from "@/components/icons/close-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import { parseNotification } from "@/utils/parse-notification";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import clsx from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useEffect, useState, type FunctionComponent } from "react";

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
  useEffect(() => {
    (async () => {
      const data = await supabaseClient
        .from("notifications")
        .select(
          "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)"
        )
        .eq("users.id", user.id);

      console.log({ data });
      setNotifications(data.data);
    })();
  }, []);
  const [isOpen, setIsOpen] = useState(false);
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
        className="icon-button text-neutral-600"
      >
        <NotificationsIcon />
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
        <div className="px-7">
          {notifications.map((notification) => {
            const { href, body, textHref, title } =
              parseNotification(notification);
            return (
              <div key={notification.id} className="flex flex-col gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <button className="icon-button border border-neutral-300">
                    <NotificationsIcon className="" size="xs" />
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
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
