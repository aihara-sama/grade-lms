"use client";

import Tab from "@/components/tabs/tab";
import type { ITab } from "@/interfaces/tabs.interface";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface IProps {
  tabs: ITab[];
}

const Tabs: FunctionComponent<IProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="overflow-auto flex flex-col flex-[1]">
      <div className="flex items-center text-sm gap-[6px] border-b-2 border-t-2 border-gray-200">
        {tabs.map((tab, idx) => (
          <Tab
            onClick={() => setActiveTab(idx)}
            Icon={tab.Icon}
            title={tab.title}
            isActive={idx === activeTab}
            key={idx}
          />
        ))}
      </div>
      <div className="mx-[0] my-[16px] flex-[1] flex flex-col">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
