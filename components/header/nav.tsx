import type { NavItem } from "@/interfaces/navigation.interface";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface Props {
  navItems: NavItem[];
}

const Nav: FunctionComponent<Props> = ({ navItems }) => {
  return (
    <div className="hidden md:flex items-center gap-8 ml-9">
      {navItems.map(({ title, href, Icon }, idx) => (
        <Link href={href} key={idx} className="flex items-center gap-2">
          {Icon}
          <span className="text-sm"> {title}</span>
        </Link>
      ))}
    </div>
  );
};

export default Nav;
