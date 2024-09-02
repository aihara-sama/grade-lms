"use client";

import type { FunctionComponent } from "react";

import AvatarIcon from "@/components/icons/avatar-icon";
import { useRouter } from "next/navigation";

interface Props {
  total: number;
  title?: string;
  href?: string;
}

const TotalUsers: FunctionComponent<Props> = ({
  total,
  href,
  title = "Total users",
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center p-[24px] w-[280px] rounded-[5px] shadow-md">
      <AvatarIcon size="lg" />
      <hr />
      <p>{title}</p>
      <p className="mt-[8px] text-4xl">{total}</p>
      {href && (
        <button
          className="primary-button w-full mt-[8px]"
          onClick={() => router.push(href)}
        >
          View all
        </button>
      )}
    </div>
  );
};

export default TotalUsers;
