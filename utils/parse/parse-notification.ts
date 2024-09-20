import type { getNotifications } from "@/db/notification";
import { NotificationType } from "@/interfaces/notifications.interface";
import type { ResultOf } from "@/types";

export const parseNotification = (
  notification: ResultOf<typeof getNotifications>[number]
) => {
  if (notification.type === NotificationType.Assignment) {
    return {
      title: `New assignment in ${notification?.course?.title || "Deleted"}`,
      body: `Your teacher has created a new assignment for the ${notification?.lesson?.title || "Deleted"} lesson`,
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
