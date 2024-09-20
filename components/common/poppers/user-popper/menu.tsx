import ProfileIcon from "@/components/icons/profile-icon";
import { Role } from "@/enums/role.enum";
import type { MenuItem } from "@/interfaces/menu.interface";

export const menu: MenuItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    Icon: <ProfileIcon />,
    tier: [Role.Teacher, Role.Student],
  },
];
