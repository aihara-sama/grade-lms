"use client";

import Tab from "@/components/nav-tabs/tab";
import { useUser } from "@/hooks/use-user";
import type { MenuItem } from "@/interfaces/menu.interface";
import { usePathname } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  tabs: MenuItem[];
}

const NavTabs: FunctionComponent<Props> = ({ tabs }) => {
  // Hooks
  const user = useUser((state) => state.user);
  const pathname = usePathname();

  // View
  return (
    <div className="flex gap-[6px] border-t-2 border-b-2 border-gray-200 overflow-x-auto overflow-y-hidden">
      {tabs
        .filter(({ views }) => views.includes(user.role))
        .map((tab, idx) => (
          <Tab
            views={tab.views}
            href={tab.href}
            Icon={tab.Icon}
            title={tab.title}
            isActive={pathname === tab.href}
            key={idx}
          />
        ))}
    </div>
  );
};
export default NavTabs;
