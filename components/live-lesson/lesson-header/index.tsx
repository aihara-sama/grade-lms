import Breadcrumbs from "@/components/breadcrumbs";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import NotificationsIcon from "@/components/icons/notifications-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import LiveTime from "@/components/live-time";
import NavigationTabs from "@/components/nav-tabs";

import type { Database } from "@/types/supabase.type";
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react";

interface IItem {
  title: string;
  href: string;
  Icon: ReactNode;
}

interface IProps {
  course: Database["public"]["Tables"]["courses"]["Row"];
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
}

const LessonHeader: FunctionComponent<PropsWithChildren<IProps>> = ({
  course,
  lesson,
}) => {
  const tabs: IItem[] = [
    {
      title: "Overview",
      href: `/dashboard/courses/${course.id}/lessons/${lesson?.id}/overview`,
      Icon: <OverviewIcon />,
    },
    {
      title: "Assignments",
      href: `/dashboard/courses/${course.id}/lessons/${lesson?.id}/assignments`,
      Icon: <AssignmentsIcon />,
    },
    {
      title: "Settings",
      href: `/dashboard/courses/${course.id}/lessons/${lesson?.id}/settings`,
      Icon: <SettingsIcon />,
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
            title: course?.title,
            href: `/dashboard/courses/${course.id}/overview`,
          },
          {
            title: "Lessons",
            href: `/dashboard/courses/${course.id}/lessons`,
          },
          {
            isCurrentPage: true,
            title: lesson?.title,
            href: `/dashboard/courses/${course.id}/lessons/${lesson?.id}/overview`,
          },
        ]}
      />
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-neutral-600 my-3">
          {lesson?.title}
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
      <NavigationTabs tabs={tabs} />
    </div>
  );
};

export default LessonHeader;
