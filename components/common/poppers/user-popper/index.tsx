"use client";

import Link from "next/link";
import { type FunctionComponent } from "react";

import BasePopper from "@/components/common/poppers/base-popper";
import LogoutIcon from "@/components/icons/logout-icon";
import ProfileIcon from "@/components/icons/profile-icon";
import type { INavItem } from "@/interfaces/menu.interface";
import type { ROLES } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const menu: INavItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    Icon: ProfileIcon,
  },
];
interface IProps {
  role: ROLES;
  avatar: string;
  userName: string;
}

const UserPopper: FunctionComponent<IProps> = ({ role, userName, avatar }) => {
  // Hooks
  const router = useRouter();

  // Handlers
  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) toast("Something went wrong! Try later");
    else router.push("/sign-in");
  };

  // View
  return (
    <>
      <div>
        <BasePopper
          width="md"
          trigger={
            <div className="cursor-pointer">
              <img
                className="rounded-[50%] w-7 h-7 object-cover"
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
                alt=""
              />
            </div>
          }
        >
          <div className="ml-4 flex items-center gap-2">
            <img
              className="rounded-[50%] w-9 h-9"
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
              alt=""
            />
            <div className="flex flex-col justify-between flex-1">
              <div className="font-bold text-base">{userName}</div>
              <div className="text-sm text-light">{role}</div>
            </div>
          </div>

          <hr className="my-3" />
          <ul className="flex flex-col">
            {menu.map(({ title, href, Icon }, idx) => (
              <li key={idx}>
                <Link
                  href={href}
                  key={idx}
                  className="px-[14px] py-[10px] flex gap-2 items-center rounded-[3px] text-sm cursor-pointer hover:bg-gray-100 hover:text-link"
                >
                  <Icon />
                  {title}
                </Link>
              </li>
            ))}
            <li
              className="px-[14px] py-[10px] flex gap-2 items-center rounded-[3px] text-sm cursor-pointer hover:bg-gray-100 hover:text-link"
              onClick={handleSignOut}
            >
              <LogoutIcon />
              Logout
            </li>
          </ul>
        </BasePopper>
      </div>
    </>
  );
};

export default UserPopper;
