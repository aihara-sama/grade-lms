"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import Link from "next/link";

import type { IBreadcrumb } from "@/interfaces/breadcrumbs.interface";
import { usePathname } from "next/navigation";
import type { FunctionComponent } from "react";

interface Props {
  Icon: JSX.Element;
  items: IBreadcrumb[];
}

const Breadcrumbs: FunctionComponent<Props> = ({ Icon, items }) => {
  const pathname = usePathname();

  const isCurrentPage = (href: string) => href === pathname;

  return (
    <ul className="flex items-center text-sm gap-2 [&>*]:max-w-24 whitespace-nowrap overflow-ellipsis overflow-hidden">
      {items.map(({ href, title }, idx) =>
        isCurrentPage(href) ? (
          <li className="text-neutral-600" key={idx}>
            {title}
          </li>
        ) : (
          <li key={idx} className="flex items-center gap-2">
            <Link
              href={href}
              className="flex items-center gap-2 text-neutral-600 font-bold"
            >
              {idx === 0 && Icon}
              {title}
              {idx !== items.length - 1 && <ArrowRightIcon />}
            </Link>
          </li>
        )
      )}
    </ul>
  );
};

export default Breadcrumbs;
