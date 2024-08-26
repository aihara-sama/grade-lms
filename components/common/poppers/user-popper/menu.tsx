import ProfileIcon from "@/components/icons/profile-icon";
import type { IMenuItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";

export const menu: IMenuItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    Icon: <ProfileIcon />,
    tier: [Role.Teacher, Role.Student],
  },
];
