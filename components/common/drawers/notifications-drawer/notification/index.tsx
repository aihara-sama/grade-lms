import NotificationsIcon from "@/components/icons/notifications-icon";
import type { getNotifications } from "@/db/notification";
import { readNotification } from "@/db/notification";
import type { ResultOf } from "@/types";
import { parseNotification } from "@/utils/parse-notification";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  notification: ResultOf<typeof getNotifications>[number];
  onReadNotification: () => void;
  onNavigateAway: () => void;
}

const Notification: FunctionComponent<Props> = ({
  notification,
  onNavigateAway,
  onReadNotification,
}) => {
  const { body, href, textHref, title } = parseNotification(notification);

  const handleReadNotification = async () => {
    try {
      await readNotification(notification.id);
      onReadNotification();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMouseEnter = () => {
    if (!notification.is_read) handleReadNotification();
  };

  return (
    <div onMouseEnter={handleMouseEnter} className="flex flex-col pb-4 px-7 ">
      <div className="flex items-start gap-2">
        <button className="relative icon-button border border-neutral-300">
          <NotificationsIcon className="" size="xs" />
          <div
            className={`absolute bottom-[-18px] w-[10px] h-[10px]  rounded-[50%] border border-white ${!notification.is_read ? "bg-red-500" : "bg-transparent"} transition-all`}
          ></div>
        </button>
        <div>
          <p className="text-neutral-700 text-[15px] font-bold">{title}</p>
          <p className="">{body}</p>
          <p className="text-sm text-neutral-500 mb-2">
            {formatDistanceToNowStrict(new Date(notification.created_at))}
          </p>
          <Link href={href} className="text-sm" onClick={onNavigateAway}>
            {textHref}
          </Link>
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default Notification;
