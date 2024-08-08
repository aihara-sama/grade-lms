"use client";

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
  avatar: string;
  role: ROLES;
}

const User: FunctionComponent<IProps> = (props) => {
  const { userName, role, avatar } = props;
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
        <img
          className="[border-radius:50%] w-7 h-7"
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
          alt=""
        />
      </div>
      <UserPopper
        avatar={avatar}
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
