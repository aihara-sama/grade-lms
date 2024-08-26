"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import Link from "next/link";

import type { IBreadcrumb } from "@/interfaces/breadcrumbs.interface";
import { usePathname } from "next/navigation";
import type { FunctionComponent } from "react";

interface IProps {
  Icon: JSX.Element;
  items: IBreadcrumb[];
}

const Breadcrumbs: FunctionComponent<IProps> = ({ Icon, items }) => {
  const pathname = usePathname();

  const isCurrentPage = (href: string) => href === pathname;

  return (
    <ul className="flex items-center text-sm gap-2 [&>*]:max-w-24 whitespace-nowrap overflow-ellipsis overflow-hidden">
      {items.map(({ href, title }, idx) =>
        isCurrentPage(href) ? (
          <li key={idx} className="flex items-center gap-2">
            <Link href={href} className="flex items-center gap-2 text-link">
              {idx === 0 && Icon}
              {title}
            </Link>
            <ArrowRightIcon />
          </li>
        ) : (
          <li className="text-light" key={idx}>
            {title}
          </li>
        )
      )}
    </ul>
  );
};

export default Breadcrumbs;
