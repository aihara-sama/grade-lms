import Link from "next/link";
import { type FunctionComponent } from "react";

import Avatar from "@/components/avatar";
import SignOutButton from "@/components/buttons/sign-out-button";
import BasePopper from "@/components/common/poppers/base-popper";
import { menu } from "@/components/common/poppers/user-popper/menu";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { PropsWithClassName } from "@/types/props.type";

const UserPopper: FunctionComponent<PropsWithClassName> = async ({
  className = "",
}) => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  // View
  return (
    <BasePopper
      width="md"
      className={className}
      trigger={
        <Avatar avatar={user.user_metadata.avatar} className="cursor-pointer" />
      }
    >
      <div className="ml-4 flex items-center gap-2">
        <Avatar avatar={user.user_metadata.avatar} />
        <div className="flex flex-col justify-between flex-1">
          <div className="font-bold text-base">{user.user_metadata.name}</div>
          <div className="text-sm text-light">{user.user_metadata.role}</div>
        </div>
      </div>

      <hr className="my-3" />
      <ul className="flex flex-col">
        {menu.map(({ title, href, Icon }, idx) => (
          <li key={idx}>
            <Link href={`${href}`} key={idx} className="base-link">
              {Icon}
              {title}
            </Link>
          </li>
        ))}
        <li className="mx-3 mt-3">
          <SignOutButton className="w-full" />
        </li>
      </ul>
    </BasePopper>
  );
};

export default UserPopper;
