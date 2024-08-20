"use client";

import Tab from "@/components/nav-tabs/tab";
import type { ITabItem } from "@/interfaces/menu.interface";
import { usePathname } from "next/navigation";

import type { FunctionComponent } from "react";

interface IProps {
  tabs: ITabItem[];
}

const NavigationTabs: FunctionComponent<IProps> = ({ tabs }) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-[6px] border-t-2 border-b-2 border-gray-200">
      {tabs.map((tab, idx) => (
        <Tab
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

export default NavigationTabs;
