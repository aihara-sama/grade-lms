"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import MembersIcon from "@/components/icons/members-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import NavTabs from "@/components/nav-tabs";
import type { TabItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/course.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
}

const CourseHeader: FunctionComponent<PropsWithChildren<Props>> = ({
  course,
}) => {
  const tabs: TabItem[] = [
    {
      title: "Overview",
      href: `/dashboard/courses/${course.id}/overview`,
      Icon: <OverviewIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Lessons",
      href: `/dashboard/courses/${course.id}/lessons`,
      Icon: <LessonsIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Members",
      href: `/dashboard/courses/${course.id}/members`,
      Icon: <MembersIcon />,
      tier: [Role.Teacher, Role.Student],
    },
    {
      title: "Settings",
      href: `/dashboard/courses/${course.id}/settings`,
      Icon: <SettingsIcon />,
      tier: [Role.Teacher],
    },
  ];

  return (
    <>
      <Breadcrumbs
        Icon={<CoursesIcon />}
        items={[
          {
            title: "Courses",
            href: `/dashboard/courses`,
          },
          {
            title: course.title,
            href: `/dashboard/courses/${course.id}/overview`,
          },
        ]}
      />
      <p
        className="text-3xl font-bold text-neutral-600 my-3 truncate-fade max-w-96"
        title={course.title}
      >
        {course.title}
      </p>
      <NavTabs tabs={tabs} />
    </>
  );
};

export default CourseHeader;
