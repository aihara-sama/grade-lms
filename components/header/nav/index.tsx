"use client";

import QuickLessonButton from "@/components/buttons/quick-lesson-button";
import { menu } from "@/components/header/menu";
import { useUser } from "@/hooks/use-user";
import type { PropsWithClassName } from "@/types/props.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Nav: FunctionComponent<PropsWithClassName> = ({ className = "" }) => {
  // Hooks
  const user = useUser((state) => state.user);

  // View
  return (
    <div className={`hidden md:flex items-center gap-6 ml-9 ${className}`}>
      {menu
        .filter(({ views }) => views.includes(user.role))
        .map(({ title, href, Icon }, idx) => (
          <Link href={`${href}`} key={idx} className="flex items-center gap-2">
            {Icon}
            <span className="text-sm"> {title}</span>
          </Link>
        ))}

      {user.role === "Teacher" && <QuickLessonButton />}
    </div>
  );
};

export default Nav;
