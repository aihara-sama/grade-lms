"use client";

import type { IItem } from "@/interfaces/menu.interface";
import Link from "next/link";
import type {
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { useEffect, useRef } from "react";

import LogoutIcon from "@/components/icons/logout-icon";
import type { ROLES } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface IProps {
  items: IItem[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  anhrolElRef: MutableRefObject<HTMLDivElement>;
  userName: string;
  role: ROLES;
  avatar: string;
}

const UserPopper: FunctionComponent<IProps> = ({
  items,
  isOpen,
  setIsOpen,
  anhrolElRef,
  role,
  userName,
  avatar,
}) => {
  const router = useRouter();
  const popperRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(
          popperRef.current?.contains(event.target as Node) ||
          anhrolElRef.current?.contains(event.target as Node)
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) toast("Something went wrong! Try later");
    else router.push("/sign-in");
  };

  return (
    <div
      ref={popperRef}
      className={`${isOpen ? "block" : "hidden"} bg-white shadow-sm absolute right-[22px] top-[71px] w-[230px] px-[0] py-[14px] rounded-[3px] z-[999]`}
    >
      <div className="ml-[16px] flex items-center gap-[8px]">
        <img
          className="[border-radius:50%] w-9 h-9"
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
          alt=""
        />
        <div className="flex flex-col justify-between flex-[1]">
          <div className="font-bold text-base">{userName}</div>
          <div className="text-sm text-light">{role}</div>
        </div>
      </div>

      <hr className="my-3" />
      <div className="flex flex-col">
        {items.map(({ title, href, Icon }, idx) => (
          <Link
            href={href}
            key={idx}
            className="px-[14px] py-[10px] flex gap-[8px] items-center rounded-[3px] text-sm cursor-pointer hover:bg-gray-100 hover:text-link"
          >
            <Icon />
            {title}
          </Link>
        ))}
        <div
          className="px-[14px] py-[10px] flex gap-[8px] items-center rounded-[3px] text-sm cursor-pointer hover:bg-gray-100 hover:text-link"
          onClick={handleSignOut}
        >
          <LogoutIcon />
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserPopper;
