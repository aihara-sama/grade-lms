import Breadcrumbs from "@/components/breadcrumbs";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import MembersIcon from "@/components/icons/members-icon";
import SettingsIcon from "@/components/icons/settings-icon";
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
}

const CourseHeader: FunctionComponent<PropsWithChildren<IProps>> = ({
  course,
}) => {
  const tabs: IItem[] = [
    {
      title: "Overview",
      href: `/dashboard/courses/${course?.id}/overview`,
      Icon: <OverviewIcon />,
    },
    {
      title: "Lessons",
      href: `/dashboard/courses/${course?.id}/lessons`,
      Icon: <LessonsIcon />,
    },
    {
      title: "Members",
      href: `/dashboard/courses/${course?.id}/members`,
      Icon: <MembersIcon />,
    },
    {
      title: "Settings",
      href: `/dashboard/courses/${course?.id}/settings`,
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
            title: course?.title,
            href: `/dashboard/courses/${course?.id}`,
          },
        ]}
      />
      <p className="page-title">{course?.title}</p>
      <NavigationTabs tabs={tabs} />
    </>
  );
};

export default CourseHeader;
