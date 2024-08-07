import Link from "next/link";
import { useState, type FunctionComponent } from "react";

interface IProps {
  Icon: JSX.Element;
  title: string;
  checked?: boolean;
  subtitle: string;
  onClick: () => void;
  onToggle?: (checked: boolean) => void;
  href?: string;
}

const CardTitle: FunctionComponent<IProps> = ({
  Icon,
  href,
  title,
  checked,
  subtitle,
  onClick,
  onToggle,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  return (
    <div
      className="text-primary flex items-center gap-3"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {onToggle && (isCardHovered || checked) ? (
        <input
          className="m-2 cursor-pointer w-4 h-4"
          onChange={(e) => onToggle(e.target.checked)}
          type="checkbox"
        />
      ) : (
        Icon
      )}
      <div className="flex flex-col justify-between gap-[2px] overflow-hidden flex-1">
        <div
          onClick={onClick}
          className="cursor-pointer font-bold text-sm overflow-hidden overflow-ellipsis"
        >
          {href ? <Link href={href}>{title}</Link> : title}
        </div>
        <div className="text-xs text-light">{subtitle}</div>
      </div>
    </div>
  );
};

export default CardTitle;
