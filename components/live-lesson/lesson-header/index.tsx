import Breadcrumbs from "@/components/breadcrumbs";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import LiveTime from "@/components/live-time";
import NavTabs from "@/components/nav-tabs";
import type { ITabItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface IProps {
  course: Course;
  lesson: Lesson;
}

const LessonHeader: FunctionComponent<PropsWithChildren<IProps>> = ({
  course,
  lesson,
}) => {
  const tabs: ITabItem[] = [
    {
      title: "Overview",
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
      Icon: <OverviewIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Assignments",
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/assignments`,
      Icon: <AssignmentsIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Settings",
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/settings`,
      Icon: <SettingsIcon />,
      tier: [Role.Teacher, Role.Student],
    },
  ];

  const isLessonOngoing =
    Date.now() > +new Date(lesson.starts) &&
    Date.now() < +new Date(lesson.ends);

  return (
    <div>
      <Breadcrumbs
        Icon={<CoursesIcon />}
        items={[
          { title: "Courses", href: "/dashboard/courses" },
          {
            title: course.title,
            href: `/dashboard/courses/${course.id}/overview`,
          },
          {
            title: "Lessons",
            href: `/dashboard/courses/${course.id}/lessons`,
          },
          {
            title: lesson.title,
            href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
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
                isLessonOngoing ? "bg-green-500" : "bg-yellow-200"
              }`}
            ></div>
            {isLessonOngoing ? (
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
