import Link from "next/link";

import type { FunctionComponent, ReactNode } from "react";

interface IProps {
  isActive: boolean;
  Icon: ReactNode;
  title: string;
  href: string;
}

const Tab: FunctionComponent<IProps> = ({ Icon, isActive, title, href }) => {
  return (
    <Link
      className={`border-b-2 border-${isActive ? "link" : "transparent"} px-[0] py-[5px] mx-[0] -my-[2px]`}
      href={href}
    >
      <div
        className={`flex gap-[8px] items-center px-[12px] py-[8px] cursor-pointer rounded-[6px] [transition:0.2s_background] text-${isActive ? "link" : "primary"} hover:bg-slate-100`}
      >
        {Icon}
        <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
          {title}
        </span>
      </div>
    </Link>
  );
};

export default Tab;
