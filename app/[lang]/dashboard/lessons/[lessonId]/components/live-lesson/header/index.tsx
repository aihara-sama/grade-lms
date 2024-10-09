"use client";

import Breadcrumbs from "@/components/common/breadcrumbs";
import NavTabs from "@/components/common/tabs/nav-tabs";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import LessonStatus from "@/components/lesson/lesson-status";
import { useLesson } from "@/hooks/use-lesson";
import type { MenuItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/course.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
}

const Header: FunctionComponent<PropsWithChildren<Props>> = ({ course }) => {
  // Hooks
  const lesson = useLesson((state) => state.lesson);
  const t = useTranslations();

  const tabs: MenuItem[] = [
    {
      title: t("lesson.tabs.overview.title"),
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
      Icon: <OverviewIcon />,
      tier: ["teacher", "student"],
    },
    {
      title: t("lesson.tabs.assignments.title"),
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/assignments`,
      Icon: <AssignmentsIcon />,
      tier: ["teacher", "student"],
    },
    {
      title: t("lesson.tabs.settings.title"),
      href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/settings`,
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
            title: t("lesson.breadcrumbs.courses"),
            href: `/dashboard/courses`,
          },
          {
            title: course.title,
            href: `/dashboard/courses/${course.id}/overview`,
          },
          {
            title: t("lesson.breadcrumbs.lessons"),
            href: `/dashboard/courses/${course.id}/lessons`,
          },
          {
            title: lesson.title,
            href: `/dashboard/courses/${course.id}/lessons/${lesson.id}/overview`,
          },
        ]}
      />
      <div className="flex items-center justify-between">
        <p
          className="text-3xl font-bold text-neutral-600 my-3 truncate-fade max-w-96 mr-8 w-full"
          title={lesson.title}
        >
          {lesson.title}
        </p>
        <LessonStatus />
      </div>
      <NavTabs tabs={tabs} />
    </div>
  );
};

export default Header;
