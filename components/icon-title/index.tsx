import Link from "next/link";
import type { FunctionComponent } from "react";

interface Props {
  Icon: JSX.Element;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
}

const IconTitle: FunctionComponent<Props> = ({
  subtitle,
  title,
  Icon,
  href,
  onClick,
}) => {
  const titleWrapper = (
    <div className="font-bold text-sm overflow-hidden overflow-ellipsis cursor-pointer">
      {title}
    </div>
  );
  const contents = (
    <div className="flex items-center justify-center gap-3 text-primary [&>.icon]:rounded-[50%]">
      {Icon}
      <div className="flex flex-col flex-1 justify-between gap-[2px] overflow-hidden">
        {href ? (
          <Link href={href} className="self-start">
            {titleWrapper}
          </Link>
        ) : (
          titleWrapper
        )}
        <div className="text-xs text-light">{subtitle}</div>
      </div>
    </div>
  );
  return href ? contents : <div onClick={onClick}>{contents}</div>;
};

export default IconTitle;
