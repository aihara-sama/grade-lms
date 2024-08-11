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
    <div className="shadow-md flex flex-col items-center p-6 w-full rounded-md sm:w-64 text-neutral-600">
      {Icon}
      <hr className="w-full my-3" />
      <p className="text-neutral-500">{title}</p>
      <p className="mt-2 text-4xl text-neutral-600">{total}</p>
      {href && (
        <Link className="mt-3 w-full" href={href}>
          <button className="primary-button w-full">View all</button>
        </Link>
      )}
    </div>
  );
};

export default Total;
