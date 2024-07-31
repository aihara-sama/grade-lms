import Link from "next/link";
import type { FunctionComponent } from "react";

interface IProps {
  Icon: JSX.Element;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
}

const IconTitle: FunctionComponent<IProps> = ({
  subtitle,
  title,
  Icon,
  href,
  onClick,
}) => {
  const contents = (
    <div className="flex items-center gap-[12px] text-primary [&>.icon]:rounded-[50%] [&>.icon]p-[4px] [&>.icon]w-[40px] [&>.icon]h-[40px] [&>.icon]flex justify-center [&>.icon]items-center [&>.icon]text-sm shadow-sm ">
      {Icon}
      <div className="flex flex-col justify-between gap-[2px] overflow-hidden flex-[1]">
        {href ? (
          <Link href={href} className="self-start">
            <div className="font-bold text-sm overflow-hidden overflow-ellipsis">
              {title}
            </div>
          </Link>
        ) : (
          <div className="font-bold text-sm overflow-hidden overflow-ellipsis">
            {title}
          </div>
        )}
        <div className="text-xs text-light">{subtitle}</div>
      </div>
    </div>
  );
  return href ? contents : <div onClick={onClick}>{contents}</div>;
};

export default IconTitle;
