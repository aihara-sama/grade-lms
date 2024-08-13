import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface IProps {
  className?: string;
  size?: keyof typeof IconSize;
}

const DotsIcon: FunctionComponent<IProps> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 4}
      height={IconSize[size] || 14}
      className={className}
      viewBox="0 0 4 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="1.66667" cy="1.66667" r="1.66667" fill="#D9D9D9" />
      <circle cx="1.66667" cy="7.00004" r="1.66667" fill="#D9D9D9" />
      <circle cx="1.66667" cy="12.3333" r="1.66667" fill="#D9D9D9" />
    </svg>
  );
};

export default DotsIcon;
