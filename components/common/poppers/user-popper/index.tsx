"use client";

import Link from "next/link";
import { type FunctionComponent } from "react";

import Avatar from "@/components/avatar";
import BasePopper from "@/components/common/poppers/base-popper";
import { menu } from "@/components/common/poppers/user-popper/menu";
import LogoutIcon from "@/components/icons/logout-icon";
import { useUser } from "@/hooks/use-user";
import type { PropsWithClassName } from "@/types";
import { db } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UserPopper: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();

  // Handlers
  const handleSignOut = async () => {
    try {
      const { error } = await db.auth.signOut();

      if (error) throw new Error(t("something_went_wrong"));
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <BasePopper
      width="md"
      className={className}
      trigger={<Avatar avatar={user.avatar} className="cursor-pointer" />}
    >
      <div className="ml-4 flex items-center gap-2">
        <Avatar avatar={user.avatar} />
        <div className="flex flex-col justify-between flex-1">
          <div className="font-bold text-base">{user.name}</div>
          <div className="text-sm text-light">{user.role}</div>
        </div>
      </div>

      <hr className="my-3" />
      <ul className="flex flex-col">
        {menu.map(({ title, href, Icon }, idx) => (
          <li key={idx}>
            <Link
              href={`/${user.preferred_locale}${href}`}
              key={idx}
              className="base-link"
            >
              {Icon}
              {title}
            </Link>
          </li>
        ))}
        <li className="base-link" onClick={handleSignOut}>
          <LogoutIcon />
          Logout
        </li>
      </ul>
    </BasePopper>
  );
};

export default UserPopper;
