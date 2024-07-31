import type { NavItem } from "@/interfaces/navigation.interface";
import type { IUserMetadata } from "@/interfaces/user.interface";
import type { User as IUser } from "@supabase/supabase-js";
import type { FunctionComponent } from "react";
import MobileDrawer from "../drawers/mobile-drawer";
import CalendarIcon from "../icons/calendar-icon";
import CoursesIcon from "../icons/courses-icon";
import OverviewIcon from "../icons/overview-icon";
import UsersIcon from "../icons/users-icon";
import Logo from "../logo";
import Nav from "./nav";
import QuickActions from "./quick-actions";
import User from "./user";

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
  return (
    <div className="flex p-4 items-center shadow-lg">
      <Logo />
      <Nav navItems={navItems} />
      <QuickActions />
      <User
        userName={(user.user_metadata as IUserMetadata).name}
        role={(user.user_metadata as IUserMetadata).role}
      />
      <MobileDrawer navItems={navItems} />
    </div>
  );
};

export default Header;
