import Link from "next/link";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";

interface IProps {
  Icon: JSX.Element;
  title: string;
  checked?: boolean;
  subtitle: string;
  onClick?: () => void;
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
  // State
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Hanlders
  const handleMouseEnter = () => setIsCardHovered(true);
  const handleMouseLeave = () => setIsCardHovered(false);
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) =>
    onToggle(e.target.checked);

  // View
  return (
    <div
      className="text-primary flex items-center gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {onToggle && (isCardHovered || checked) ? (
        <input
          checked={checked}
          className="m-2 cursor-pointer w-4 h-4"
          onChange={handleCheckboxChange}
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
