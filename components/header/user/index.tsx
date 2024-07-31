"use client";

import AvatarIcon from "@/components/icons/avatar-icon";
import ProfileIcon from "@/components/icons/profile-icon";
import SettingsIcon from "@/components/icons/settings-icon";
import UserPopper from "@/components/poppers/user-popper";
import type { IItem } from "@/interfaces/menu.interface";
import type { ROLES } from "@/interfaces/user.interface";
import type { FunctionComponent } from "react";
import { useRef, useState } from "react";

export const items: IItem[] = [
  {
    title: "Profile",
    href: "/profile",
    Icon: ProfileIcon,
  },
  {
    title: "Settings",
    href: "/dashboard/profile/settings",
    Icon: SettingsIcon,
  },
  // {
  //   title: "Log out",
  //   href: "/log-out",
  //   Icon: LogoutIcon,
  // },
];

interface IProps {
  userName: string;
  role: ROLES;
}

const User: FunctionComponent<IProps> = (props) => {
  const { userName, role } = props;
  const anhrolElRef = useRef<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          setIsOpen((prev) => !prev);
          e.stopPropagation(); // Needed for proper popper escape
        }}
        ref={anhrolElRef}
        className="ml-3 border-l-2 border-solid border-gray-500 flex items-center gap-[16px] pl-[16px] cursor-pointer"
      >
        <AvatarIcon />
      </div>
      <UserPopper
        userName={userName}
        role={role}
        anhrolElRef={anhrolElRef}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        items={items}
      />
    </>
  );
};

export default User;
