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
  user: {
    name: string;
  };
}) => {
  if (notification.type === "assignment") {
    return {
      title: `New assignment in ${notification.course.title}`,
      body: `Your teacher has created a new assignment for the ${notification.lesson.title} lesson`,
      href: `/en/dashboard/courses/${notification.course.id}/lessons/${notification.lesson.id}/assignments`,
      textHref: "See in assignments",
    };
  }
  throw new Error("Wrong notification type");
};
