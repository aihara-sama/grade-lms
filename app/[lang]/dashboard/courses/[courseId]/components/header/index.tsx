"use client";

import Breadcrumbs from "@/components/common/breadcrumbs";
import NavTabs from "@/components/common/tabs/nav-tabs";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import MembersIcon from "@/components/icons/members-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import type { MenuItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/course.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
}

const Header: FunctionComponent<PropsWithChildren<Props>> = ({ course }) => {
  // Hooks
  const t = useTranslations();

  const tabs: MenuItem[] = [
    {
      title: t("course.tabs.overview.title"),
      href: `/dashboard/courses/${course.id}/overview`,
      Icon: <OverviewIcon />,
      tier: ["teacher", "student"],
    },
    {
      title: t("course.tabs.lessons.title"),
      href: `/dashboard/courses/${course.id}/lessons`,
      Icon: <LessonsIcon />,
      tier: ["teacher", "student"],
    },
    {
      title: t("course.tabs.members.title"),
      href: `/dashboard/courses/${course.id}/members`,
      Icon: <MembersIcon />,
      tier: ["teacher", "student"],
    },
    {
      title: t("course.tabs.settings.title"),
      href: `/dashboard/courses/${course.id}/settings`,
      Icon: <SettingsIcon />,
      tier: ["teacher"],
    },
  ];

  // View
  return (
    <div>
      <Breadcrumbs
        Icon={<CoursesIcon />}
        items={[
          {
            title: t("course.breadcrumbs.courses"),
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
