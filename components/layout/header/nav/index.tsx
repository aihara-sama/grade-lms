"use client";

import QuickLessonButton from "@/components/common/buttons/quick-lesson-button";
import { navigation } from "@/components/layout/header/navigation";
import { useUser } from "@/hooks/use-user";
import type { Navigation } from "@/types/navigation.type";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Nav: FunctionComponent<PropsWithClassName> = ({ className = "" }) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // View
  return (
    <div className={`hidden md:flex items-center gap-6 ml-9 ${className}`}>
      {navigation
        .filter(({ tier }) => tier.includes(user.role))
        .map(({ title, href, Icon }, idx) => (
          <Link href={`${href}`} key={idx} className="flex items-center gap-2">
            {Icon}
            <span className="text-sm">
              {t(`dashboard.header.navigation.${title as Navigation}`)}
            </span>
          </Link>
        ))}

      {user.role === "Teacher" && <QuickLessonButton />}
    </div>
  );
};

export default Nav;
