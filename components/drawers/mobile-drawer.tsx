"use client";

import Logo from "@/components/logo";
import type { NavItem } from "@/interfaces/navigation.interface";
import clsx from "clsx";
import Link from "next/link";
import { useState, type FunctionComponent } from "react";

interface Props {
  navItems: NavItem[];
}
const MobileDrawer: FunctionComponent<Props> = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Hamburger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex md:hidden h-5 w-6 z-[2] flex-col justify-between cursor-pointer ml-4 left-5 top-4"
      >
        {[...Array(3)].map((_, idx) => (
          <span className="block h-1 w-full rounded-lg bg-black" key={idx} />
        ))}
      </div>

      {/* Actual Drawer */}
      <div
        className={clsx(
          "bg-white md:-left-full transition-[0.4s] duration-[left] absolute w-full z-[1] inset-y-0 -left-full",
          { "left-0": isOpen }
        )}
      >
        <div className="shadow-lg py-4 pl-7 flex">
          <Logo />
        </div>
        <div className="pl-7">
          <div className="flex flex-col gap-4 mt-4">
            {navItems.map(({ title, href, Icon }, idx) => (
              <Link href={href} key={idx} className="flex items-center gap-2">
                {Icon}
                <span className="text-md"> {title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
