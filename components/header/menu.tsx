import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { MenuItem } from "@/interfaces/menu.interface";

export const menu: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    Icon: <OverviewIcon />,
    views: ["Teacher", "Student"],
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
    views: ["Teacher", "Student"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
    views: ["Teacher"],
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
    views: ["Teacher", "Student"],
  },
];
