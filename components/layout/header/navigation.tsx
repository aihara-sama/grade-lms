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
    tier: ["teacher", "student"],
  },
  {
    title: "courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
    tier: ["teacher", "student"],
  },
  {
    title: "users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
    tier: ["teacher"],
  },
  {
    title: "schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
    tier: ["teacher", "student"],
  },
];
