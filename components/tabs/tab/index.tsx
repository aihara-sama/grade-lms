"use client";

import type { FunctionComponent, ReactNode } from "react";

interface Props {
  isActive: boolean;
  Icon: ReactNode;
  title: string;
  onClick: () => void;
}

const Tab: FunctionComponent<Props> = ({ Icon, isActive, title, onClick }) => {
  return (
    <div
      className={`border-b-2 ${isActive ? "border-link" : "border-transparent"} px-[0] py-[5px] mx-[0] -my-[2px]`}
      onClick={onClick}
    >
      <div
        className={`flex gap-[8px] items-center px-[12px] py-[8px] cursor-pointer rounded-[6px] [transition:0.2s_background] ${isActive ? "text-link" : "text-primary"} hover:bg-slate-200`}
      >
        {Icon}
        <span className="text-sm">{title}</span>
      </div>
    </div>
  );
};

export default Tab;
