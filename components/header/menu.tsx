import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { IMenuItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";

export const menu: IMenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    Icon: <OverviewIcon />,
    tier: [Role.Teacher, Role.Student],
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
    tier: [Role.Teacher, Role.Student],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
    tier: [Role.Teacher],
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
    tier: [Role.Teacher, Role.Student],
  },
];
