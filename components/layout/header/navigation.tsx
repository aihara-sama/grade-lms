import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { MenuItem } from "@/interfaces/menu.interface";

export const navigation: MenuItem[] = [
  {
    title: "dashboard",
    href: "/dashboard",
    Icon: <OverviewIcon />,
    tier: ["Teacher", "Student"],
  },
  {
    title: "courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
    tier: ["Teacher", "Student"],
  },
  {
    title: "users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
    tier: ["Teacher"],
  },
  {
    title: "schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
    tier: ["Teacher", "Student"],
  },
];
