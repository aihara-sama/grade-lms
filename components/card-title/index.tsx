import { useState, type FunctionComponent } from "react";

interface IProps {
  Icon: JSX.Element;
  title: string;
  checked?: boolean;
  subtitle: string;
  onClick: () => void;
  onToggle?: (checked: boolean) => void;
}

const CardTitle: FunctionComponent<IProps> = ({
  Icon,
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
      onClick={onClick}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {onToggle && (isCardHovered || checked) ? (
        <input
          className="m-[8.5px] cursor-pointer"
          onChange={(e) => onToggle(e.target.checked)}
          type="checkbox"
        />
      ) : (
        Icon
      )}
      <div className="flex flex-col justify-between gap-[2px] overflow-hidden flex-1">
        <div className="font-bold text-sm overflow-hidden overflow-ellipsis">
          {title}
        </div>
        <div className="text-xs text-light">{subtitle}</div>
      </div>
    </div>
  );
};

export default CardTitle;
