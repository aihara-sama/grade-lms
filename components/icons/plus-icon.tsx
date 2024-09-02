import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const PlusIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 14}
      height={IconSize[size] || 14}
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83333 12.8333C5.83333 13.4777 6.35565 14 7 14C7.64435 14 8.16667 13.4777 8.16667 12.8333V8.16667H12.8333C13.4777 8.16667 14 7.64435 14 7C14 6.35565 13.4777 5.83333 12.8333 5.83333H8.16667V1.16667C8.16667 0.522328 7.64435 0 7 0C6.35565 0 5.83333 0.522328 5.83333 1.16667V5.83333H1.16667C0.52234 5.83333 0 6.35565 0 7C0 7.64435 0.52234 8.16667 1.16667 8.16667H5.83333V12.8333Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PlusIcon;
