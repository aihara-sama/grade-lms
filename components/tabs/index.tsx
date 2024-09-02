"use client";

import Tab from "@/components/tabs/tab";
import { useUser } from "@/hooks/use-user";
import type { ITab } from "@/interfaces/tabs.interface";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface Props {
  tabs: ITab[];
}

const Tabs: FunctionComponent<Props> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const { user } = useUser();

  return (
    <div className="overflow-auto flex flex-col flex-1">
      <div className="flex items-center text-sm gap-[6px] border-b-2 border-t-2 border-gray-200">
        {tabs
          .filter(({ tier }) => tier.includes(user.role))
          .map((tab, idx) => (
            <Tab
              onClick={() => setActiveTab(idx)}
              Icon={tab.Icon}
              title={tab.title}
              isActive={idx === activeTab}
              key={idx}
            />
          ))}
      </div>
      <div className="my-4 flex-1 flex flex-col">{tabs[activeTab].content}</div>
    </div>
  );
};
export default Tabs;
