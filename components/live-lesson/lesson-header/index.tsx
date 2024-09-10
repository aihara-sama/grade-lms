import Breadcrumbs from "@/components/breadcrumbs";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import LiveTime from "@/components/live-time";
import NavTabs from "@/components/nav-tabs";
import { useUser } from "@/hooks/use-user";
import type { TabItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import { isLessonOngoing } from "@/utils/is-lesson-ongoing";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
  lesson: Lesson;
}

const LessonHeader: FunctionComponent<PropsWithChildren<Props>> = async ({
  course,
  lesson,
}) => {
  const { user } = useUser();

  const tabs: TabItem[] = [
    {
      title: "Overview",
      href: `/${user.preferred_locale}/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
      Icon: <OverviewIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Assignments",
      href: `/${user.preferred_locale}/dashboard/courses/${course.id}/lessons/${lesson.id}/assignments`,
      Icon: <AssignmentsIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Settings",
      href: `/${user.preferred_locale}/dashboard/courses/${course.id}/lessons/${lesson.id}/settings`,
      Icon: <SettingsIcon />,
      tier: [Role.Teacher, Role.Student],
    },
  ];

  const isThisLessonOngoing = isLessonOngoing(lesson);

  return (
    <div>
      <Breadcrumbs
        Icon={<CoursesIcon />}
        items={[
          {
            title: "Courses",
            href: `/${user.preferred_locale}/dashboard/courses`,
          },
          {
            title: course.title,
            href: `/${user.preferred_locale}/dashboard/courses/${course.id}/overview`,
          },
          {
            title: "Lessons",
            href: `/${user.preferred_locale}/dashboard/courses/${course.id}/lessons`,
          },
          {
            title: lesson.title,
            href: `/${user.preferred_locale}/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
          },
        ]}
      />
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-neutral-600 my-3">
          {lesson.title}
        </p>
        <div className="flex items-center gap-3">
          <div className="text-4 flex items-center gap-1 relative text-sm">
            <div
              className={`absolute block w-2 h-2 rounded-[50%] -left-4 top-[12px] ${
                isThisLessonOngoing ? "bg-green-500" : "bg-yellow-200"
              }`}
            ></div>
            {isThisLessonOngoing ? (
              "Ongoing"
            ) : (
              <>
                Starts in:{" "}
                <span className="font-bold">
                  <LiveTime date={new Date(lesson.starts)} />
                </span>
                <button className="ml-2 icon-button text-amber-600 border border-amber-600">
                  <NotificationsIcon size="xs" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <NavTabs tabs={tabs} />
    </div>
  );
};

export default LessonHeader;
