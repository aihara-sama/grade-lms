import NotificationsIcon from "@/components/icons/notifications-icon";
import type { getNotifications } from "@/db/client/notification";
import { readNotification } from "@/db/client/notification";
import type { ResultOf } from "@/types/utils.type";
import { formatDistanceToNowStrict } from "date-fns";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  notification: ResultOf<typeof getNotifications>["data"][number];
  onReadNotification: () => void;
  onNavigateAway: () => void;
}

const Notification: FunctionComponent<Props> = ({
  notification,
  onNavigateAway,
  onReadNotification,
}) => {
  console.log({ notification });

  // Hooks
  const t = useTranslations();

  const submitReadNotification = async () => {
    try {
      await readNotification(notification.id);
      onReadNotification();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onMouseEnter = () => {
    if (!notification.is_read) submitReadNotification();
  };

  return (
    <div onMouseEnter={onMouseEnter} className="flex flex-col pb-4 px-7 ">
      <div className="flex items-start gap-2">
        <button className="relative icon-button border border-neutral-300">
          <NotificationsIcon className="" size="xs" />
          <div
            className={`absolute bottom-[-18px] w-[10px] h-[10px]  rounded-[50%] border border-white ${!notification.is_read ? "bg-red-500" : "bg-transparent"} transition-all`}
          ></div>
        </button>
        <div>
          <p className="text-neutral-700 text-[15px] font-bold">
            {t(`notifications.${notification.type}.title`)}
          </p>
          <p className="text-[15px]">
            {t(`notifications.${notification.type}.body`, {
              course: notification.course?.title || t("deleted"),
              assignment: notification.assignment?.title || t("deleted"),
              lesson: notification.lesson?.title || t("deleted"),
            })}
          </p>
          <p className="text-sm text-neutral-500 mb-2">
            {formatDistanceToNowStrict(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </p>
          <Link
            href={`${t(`notifications.${notification.type}.href`, { courseId: notification.course?.id, lessonId: notification.lesson?.id })}`}
            className="text-sm"
            onClick={onNavigateAway}
          >
            {t(`notifications.${notification.type}.textHref`)}
          </Link>
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default Notification;
