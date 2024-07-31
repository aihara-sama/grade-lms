import type { FunctionComponent, ReactNode } from "react";

import Link from "next/link";

interface IProps {
  total: number;
  title: string;
  Icon: ReactNode;
  href?: string;
}

const Total: FunctionComponent<IProps> = ({ total, href, title, Icon }) => {
  return (
    <div className="shadow-md flex flex-col items-center p-[24px] w-full rounded-[5px] sm:w-[250px]">
      {Icon}
      <hr className="w-full my-3" />
      <p className="total-title">{title}</p>
      <p className="mt-[8px] text-4xl">{total}</p>
      {href && (
        <Link className="link-button w-full mt-[12px]" href={href}>
          View all
        </Link>
      )}
    </div>
  );
};

export default Total;
