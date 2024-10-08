"use client";

import Avatar from "@/components/common/avatar";
import SignOutButton from "@/components/common/buttons/sign-out-button";
import BasicPopper from "@/components/common/poppers/basic-popper";
import { navigation } from "@/components/common/poppers/user-popper/navigation";
import { useUser } from "@/hooks/use-user";
import type { Navigation } from "@/types/navigation.type";
import type { PropsWithClassName } from "@/types/props.type";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FunctionComponent } from "react";

const UserPopper: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // View
  return (
    <BasicPopper
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
        {navigation.map(({ title, href, Icon }, idx) => (
          <li key={idx}>
            <Link href={`${href}`} key={idx} className="base-link">
              {Icon}
              {t(`dashboard.header.navigation.${title as Navigation}`)}
            </Link>
          </li>
        ))}
        <li className="mx-3 mt-3">
          <SignOutButton className="w-full" />
        </li>
      </ul>
    </BasicPopper>
  );
};

export default UserPopper;
