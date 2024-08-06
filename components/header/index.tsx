"use client";

import MobileDrawer from "@/components/drawers/mobile-drawer";
import Nav from "@/components/header/nav";
import QuickActions from "@/components/header/quick-actions";
import User from "@/components/header/user";
import CalendarIcon from "@/components/icons/calendar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import UsersIcon from "@/components/icons/users-icon";
import Logo from "@/components/logo";
import { messaging } from "@/helpers/firebase";
import type { NavItem } from "@/interfaces/navigation.interface";
import type { IUserMetadata } from "@/interfaces/user.interface";
import type { User as IUser } from "@supabase/supabase-js";
import { onMessage } from "firebase/messaging";
import { useEffect, type FunctionComponent } from "react";

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    Icon: <OverviewIcon />,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    Icon: <CoursesIcon />,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    Icon: <UsersIcon />,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    Icon: <CalendarIcon />,
  },
];
interface IProps {
  user: IUser;
}
const Header: FunctionComponent<IProps> = ({ user }) => {
  useEffect(() => {
    onMessage(
      messaging,
      (payload) =>
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        })
    );
  }, []);

  return (
    <div className="flex p-4 items-center shadow-lg">
      <Logo />
      {!!user && (
        <>
          <Nav navItems={navItems} />
          <QuickActions />
          <User
            userName={(user.user_metadata as IUserMetadata).name}
            role={(user.user_metadata as IUserMetadata).role}
          />
          <MobileDrawer navItems={navItems} />
        </>
      )}
    </div>
  );
};

export default Header;
