import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { INavItem } from "@/interfaces/menu.interface";

export const navItems: INavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    Icon: OverviewIcon,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    Icon: CoursesIcon,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    Icon: UsersIcon,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    Icon: CalendarIcon,
  },
];
