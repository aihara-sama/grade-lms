import ProfileIcon from "@/components/icons/profile-icon";
import type { MenuItem } from "@/interfaces/menu.interface";

export const navigation: MenuItem[] = [
  {
    Icon: <ProfileIcon />,
    title: "profile",
    href: "/dashboard/profile",
    tier: ["teacher", "student"],
  },
];
