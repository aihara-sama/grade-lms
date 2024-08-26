"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Hamburger from "@/components/hamburger";
import { menu } from "@/components/header/menu";
import Logo from "@/components/logo";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useState, type FunctionComponent } from "react";

const MobileDrawer: FunctionComponent = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Hooks
  const { user } = useUser();

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
          <ul className="flex flex-col gap-4 mt-4">
            {menu
              .filter(({ tier }) => tier.includes(user.role))
              .map(({ title, href, Icon }, idx) => (
                <li key={idx}>
                  <Link href={href} className="flex items-center gap-2">
                    {Icon}
                    <span className="text-md"> {title}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </BaseDrawer>
    </>
  );
};

export default MobileDrawer;
