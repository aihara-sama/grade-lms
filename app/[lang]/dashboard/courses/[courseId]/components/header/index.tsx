"use client";

import Breadcrumbs from "@/components/common/breadcrumbs";
import NavTabs from "@/components/common/tabs/nav-tabs";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import MembersIcon from "@/components/icons/members-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import { Role } from "@/enums/role.enum";
import type { MenuItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/course.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
}

const Header: FunctionComponent<PropsWithChildren<Props>> = ({ course }) => {
  const tabs: MenuItem[] = [
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

  // View
  return (
    <div>
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
    </div>
  );
};

export default Header;
