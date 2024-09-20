"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import Link from "next/link";

import type { Breadcrumb } from "@/interfaces/breadcrumbs.interface";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { FunctionComponent } from "react";

interface Props {
  Icon: JSX.Element;
  items: Breadcrumb[];
}

const Breadcrumbs: FunctionComponent<Props> = ({ Icon, items }) => {
  const pathname = usePathname();

  const isCurrentPage = (href: string) => href === pathname;

  return (
    <ul className="flex items-center text-sm gap-2 whitespace-nowrap overflow-ellipsis overflow-hidden">
      {items.map(({ href, title }, idx) =>
        isCurrentPage(href) ? (
          <li
            className={`text-neutral-600 max-w-32 ${clsx(title.length >= 24 && "truncate-fade")}`}
            key={idx}
            title={title}
          >
            {title}
          </li>
        ) : (
          <li key={idx} className="flex items-center gap-2">
            <Link
              href={href}
              className="flex items-center gap-2 text-neutral-600 font-bold"
            >
              {idx === 0 && Icon}
              <span
                title={title}
                className={`max-w-32 ${clsx(title.length >= 24 && "truncate-fade")}`}
              >
                {title}
              </span>
              {idx !== items.length - 1 && <ArrowRightIcon />}
            </Link>
          </li>
        )
      )}
    </ul>
  );
};
export default Breadcrumbs;
