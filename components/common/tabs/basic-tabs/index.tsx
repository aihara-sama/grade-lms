"use client";

import Tab from "@/components/common/tabs/basic-tabs/tab";
import type { Tab as ITab } from "@/interfaces/tabs.interface";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";

interface Props {
  tabs: ITab[];
  onChange?: (tab: number) => void;
}

const BasicTabs: FunctionComponent<Props> = ({ tabs, onChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    onChange?.(activeTab);
  }, [activeTab]);

  return (
    <div className="overflow-auto flex flex-col flex-1">
      <div className="flex items-center text-sm gap-[6px] border-b-2 border-t-2 border-gray-200 overflow-x-auto overflow-y-hidden">
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
      <div className="mt-4 flex-1 flex flex-col">{tabs[activeTab].content}</div>
    </div>
  );
};
export default BasicTabs;
