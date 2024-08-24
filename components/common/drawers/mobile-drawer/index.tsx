"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Hamburger from "@/components/hamburger";
import {
  studentNavItems,
  teacherNavItems,
} from "@/components/header/nav-items";
import Logo from "@/components/logo";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useState, type FunctionComponent } from "react";

interface IProps {
  user: User;
}

const MobileDrawer: FunctionComponent<IProps> = ({ user }) => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  const getNavItems = () => {
    if ((user.user_metadata as IUserMetadata).role === Role.TEACHER)
      return teacherNavItems;
    if ((user.user_metadata as IUserMetadata).role === Role.STUDENT)
      return studentNavItems;
    return [];
  };

  // View
  return (
    <>
      <Hamburger onClick={() => setIsOpen(true)} />
      <BaseDrawer
        header={<Logo />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        placement="left"
      >
        <div className="pl-7">
          <div className="flex flex-col gap-4 mt-4">
            {getNavItems().map(({ title, href, Icon }, idx) => (
              <Link href={href} key={idx} className="flex items-center gap-2">
                <Icon />
                <span className="text-md"> {title}</span>
              </Link>
            ))}
          </div>
        </div>
      </BaseDrawer>
    </>
  );
};

export default MobileDrawer;
