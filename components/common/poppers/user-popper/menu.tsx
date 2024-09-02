import ProfileIcon from "@/components/icons/profile-icon";
import type { MenuItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";

export const menu: MenuItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    Icon: <ProfileIcon />,
    tier: [Role.Teacher, Role.Student],
  },
];
