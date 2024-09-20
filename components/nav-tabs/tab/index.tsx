import type { MenuItem } from "@/interfaces/menu.interface";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface Props extends MenuItem {
  isActive: boolean;
}

const Tab: FunctionComponent<Props> = ({ Icon, isActive, title, href }) => {
  return (
    <Link
      className={`border-b-2 border-${isActive ? "link" : "transparent"} px-0 py-[5px] mx-0 -my-[2px]`}
      href={href}
    >
      <div
        className={`flex gap-2 items-center px-3 py-2 cursor-pointer rounded-[6px] duration-500 transition-colors ${isActive ? "text-link" : "text-primary"} hover:bg-slate-100`}
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
