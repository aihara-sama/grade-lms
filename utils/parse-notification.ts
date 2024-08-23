import { NotificationType } from "@/interfaces/notifications.interface";

export const parseNotification = (notification: {
  is_read: boolean;
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
  submission?: {
    title: string;
  };
  user: {
    name: string;
  };
}) => {
  if (notification.type === NotificationType.Assignment) {
    return {
      title: `New assignment in ${notification.course.title}`,
      body: `Your teacher has created a new assignment for the ${notification.lesson.title} lesson`,
      href: `/en/dashboard/courses/${notification.course.id}/lessons/${notification.lesson.id}/assignments`,
      textHref: "See in assignments",
    };
  }
  if (notification.type === NotificationType.Submission) {
    return {
      title: `New submission in ${notification.course.title}`,
      body: `Your student has created a new submission for the ${notification.assignment.title} assignment`,
      href: `/en/dashboard/courses/${notification.course.id}/lessons/${notification.lesson.id}/assignments`,
      textHref: "See in assignments",
    };
  }
  throw new Error("Wrong notification type");
};
