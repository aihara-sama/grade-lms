"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Hamburger from "@/components/hamburger";
import { teacherNavItems } from "@/components/header/nav-items";
import Logo from "@/components/logo";
import Link from "next/link";
import { useState, type FunctionComponent } from "react";

const MobileDrawer: FunctionComponent = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // View
  return (
    <>
      <Hamburger onClick={() => setIsOpen(true)} />
      <BaseDrawer
        header={<Logo />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        placement="left"
      >
        <div className="pl-7">
          <div className="flex flex-col gap-4 mt-4">
            {teacherNavItems.map(({ title, href, Icon }, idx) => (
              <Link href={href} key={idx} className="flex items-center gap-2">
                <Icon />
                <span className="text-md"> {title}</span>
              </Link>
            ))}
          </div>
        </div>
      </BaseDrawer>
    </>
  );
};

export default MobileDrawer;
