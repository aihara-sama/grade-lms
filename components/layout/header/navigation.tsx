import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { MenuItem } from "@/interfaces/menu.interface";

export const navigation: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    Icon: <OverviewIcon />,
    tier: ["Teacher", "Student"],
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
    tier: ["Teacher", "Student"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
    tier: ["Teacher"],
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
    tier: ["Teacher", "Student"],
  },
];
