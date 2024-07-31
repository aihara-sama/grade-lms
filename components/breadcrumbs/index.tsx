import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import type { IBreadcrumb } from "@/interfaces/breadcrumbs.interface";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface IProps {
  Icon: JSX.Element;
  items: IBreadcrumb[];
}

const Breadcrumbs: FunctionComponent<IProps> = ({ Icon, items }) => {
  return (
    <div className="flex items-center text-sm gap-[8px] [&>*]:max-w-[100px] whitespace-nowrap overflow-ellipsis overflow-hidden">
      {items.map(({ href, isCurrentPage, title }, idx) =>
        !isCurrentPage ? (
          <div key={idx} className="flex items-center gap-[8px]">
            <Link href={href} className="flex items-center gap-[8px] text-link">
              {idx === 0 && Icon}
              {title}
            </Link>
            <ArrowRightIcon />
          </div>
        ) : (
          <span className="text-light" key={idx}>
            {title}
          </span>
        )
      )}
    </div>
  );
};

export default Breadcrumbs;
