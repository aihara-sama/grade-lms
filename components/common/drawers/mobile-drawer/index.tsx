"use client";

import BaseDrawer from "@/components/common/drawers/base-drawer";
import Hamburger from "@/components/hamburger";
import { menu } from "@/components/header/menu";
import Logo from "@/components/logo";
import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
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
  const { user } = useUser();

  // Handlers
  const submitCreateLesson = async () => {
    try {
      const { error, data } = await DB.from("lessons")
        .insert({
          starts: new Date().toISOString(),
          ends: addMinutes(new Date(), 30).toISOString(),
          creator_id: user.id,
        })
        .select("id")
        .single();

      if (error) throw new Error(t("failed_to_create_lesson"));
      router.push(`/dashboard/lessons/${data.id}`);
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
        <BaseDrawer
          header={<Logo />}
          placement="left"
          onClose={() => setIsOpen(false)}
        >
          <div className="px-7">
            <ul className="flex flex-col gap-4 mt-4">
              {menu
                .filter(({ tier }) => tier.includes(user.role))
                .map(({ title, href, Icon }, idx) => (
                  <li key={idx}>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href={`${href}`}
                      className="flex items-center gap-2"
                    >
                      {Icon}
                      <span className="text-md"> {title}</span>
                    </Link>
                  </li>
                ))}
            </ul>

            {user.role === Role.Teacher && (
              <button
                className="primary-button mt-4"
                onClick={submitCreateLesson}
              >
                Quick lesson
              </button>
            )}
          </div>
        </BaseDrawer>
      )}
    </>
  );
};
export default MobileDrawer;
