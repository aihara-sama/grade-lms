import type { getNotifications } from "@/db/client/notification";
import { NotificationType } from "@/interfaces/notification-type.interface";
import type { ResultOf } from "@/types/utils.type";

export const parseNotification = (
  notification: ResultOf<typeof getNotifications>["data"][number]
) => {
  if (notification.type === NotificationType.Assignment) {
    return {
      title: `New assignment in ${notification?.course?.title || "Deleted"}`,
      body: `Your teacher has created the assignment ${notification.assignment.title} for the ${notification?.lesson?.title || "Deleted"} lesson`,
      href: `/dashboard/courses/${notification?.course?.id || "Deleted"}/lessons/${notification?.lesson?.id || "Deleted"}/assignments`,
      textHref: "See in assignments",
    };
  }
  if (notification.type === NotificationType.Submission) {
    return {
      title: `New submission in ${notification?.course?.title || "Deleted"}`,
      body: `Your student has created a new submission for the ${notification?.assignment?.title || "Deleted"} assignment`,
      href: `/dashboard/courses/${notification?.course?.id || "Deleted"}/lessons/${notification?.lesson?.id || "Deleted"}/assignments`,
      textHref: "See in assignments",
    };
  }
  throw new Error("Wrong notification type");
};
