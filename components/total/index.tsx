import Link from "next/link";
import type { FunctionComponent, ReactNode } from "react";

interface IProps {
  total: number;
  title: string;
  Icon: ReactNode;
  href?: string;
}

const Total: FunctionComponent<IProps> = ({ total, href, title, Icon }) => {
  return (
    <div className="shadow-md flex flex-col items-center p-6 w-full rounded-md sm:w-64">
      {Icon}
      <hr className="w-full my-3" />
      <p className="text-neutral-500">{title}</p>
      <p className="mt-2 text-4xl text-neutral-600">{total}</p>
      {href && (
        <Link className="link-button w-full mt-3" href={href}>
          View all
        </Link>
      )}
    </div>
  );
};

export default Total;
