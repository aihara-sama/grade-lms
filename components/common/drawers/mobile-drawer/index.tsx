"use client";

import BasicDrawer from "@/components/common/drawers/basic-drawer";
import Hamburger from "@/components/common/drawers/mobile-drawer/hamburger";
import Logo from "@/components/common/logo";
import { navigation } from "@/components/layout/header/navigation";
import { createLesson } from "@/db/client/lesson";
import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import type { Navigation } from "@/types/navigation.type";
import { addMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const MobileDrawer: FunctionComponent = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const user = useUser((state) => state.user);

  // Handlers
  const submitCreateLesson = async () => {
    try {
      const lesson = await createLesson({
        starts: new Date().toISOString(),
        ends: addMinutes(new Date(), 30).toISOString(),
        creator_id: user.id,
      });

      router.push(`/dashboard/lessons/${lesson.id}`);

      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <>
      <Hamburger onClick={() => setIsOpen(true)} />
      {isOpen && (
        <BasicDrawer
          header={<Logo />}
          placement="left"
          onClose={() => setIsOpen(false)}
        >
          <div className="px-7">
            <ul className="flex flex-col gap-4 mt-4">
              {navigation
                .filter(({ tier }) => tier.includes(user.role))
                .map(({ title, href, Icon }, idx) => (
                  <li key={idx}>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href={`${href}`}
                      className="flex items-center gap-2"
                    >
                      {Icon}
                      <span className="text-md">
                        {t(
                          `dashboard.header.navigation.${title as Navigation}`
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>

            {user.role === Role.Teacher && (
              <button
                className="primary-button mt-4"
                onClick={submitCreateLesson}
              >
                {t("dashboard.header.navigation.quick_lesson")}
              </button>
            )}
          </div>
        </BasicDrawer>
      )}
    </>
  );
};
export default MobileDrawer;
