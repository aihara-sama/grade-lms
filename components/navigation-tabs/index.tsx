"use client";

import { usePathname } from "next/navigation";
import type { FunctionComponent, ReactNode } from "react";
import Tab from "./tab";

interface IItem {
  title: string;
  href: string;
  Icon: ReactNode;
}
const NavigationTabs: FunctionComponent<{ tabs: IItem[] }> = ({ tabs }) => {
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
