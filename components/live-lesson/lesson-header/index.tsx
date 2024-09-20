"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import LessonStatus from "@/components/lesson-status";
import NavTabs from "@/components/nav-tabs";
import { Role } from "@/enums/role.enum";
import type { MenuItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/course.type";
import type { Lesson } from "@/types/lesson.type";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  course: Course;
  lesson: Lesson;
}

const LessonHeader: FunctionComponent<PropsWithChildren<Props>> = ({
  course,
  lesson,
}) => {
  const tabs: MenuItem[] = [
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
      tier: [Role.Teacher],
    },
  ];

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

export default LessonHeader;
