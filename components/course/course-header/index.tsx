import Breadcrumbs from "@/components/breadcrumbs";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import MembersIcon from "@/components/icons/members-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import NavTabs from "@/components/nav-tabs";
import type { ITabItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/courses.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface IProps {
  course: Course;
}

const CourseHeader: FunctionComponent<PropsWithChildren<IProps>> = ({
  course,
}) => {
  const tabs: ITabItem[] = [
    {
      title: "Overview",
      href: `/dashboard/courses/${course.id}/overview`,
      Icon: <OverviewIcon />,
    },
    {
      title: "Lessons",
      href: `/dashboard/courses/${course.id}/lessons`,
      Icon: <LessonsIcon />,
    },
    {
      title: "Members",
      href: `/dashboard/courses/${course.id}/members`,
      Icon: <MembersIcon />,
    },
    {
      title: "Settings",
      href: `/dashboard/courses/${course.id}/settings`,
      Icon: <SettingsIcon />,
    },
  ];

  return (
    <>
      <Breadcrumbs
        Icon={<CoursesIcon />}
        items={[
          { title: "Courses", href: "/dashboard/courses" },
          {
            isCurrentPage: true,
            title: course.title,
            href: `/dashboard/courses/${course.id}`,
          },
        ]}
      />
      <p className="text-3xl font-bold text-neutral-600 my-3">{course.title}</p>
      <NavTabs tabs={tabs} />
    </>
  );
};

export default CourseHeader;
