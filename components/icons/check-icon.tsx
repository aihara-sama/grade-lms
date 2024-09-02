import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const CheckIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 32}
      height={IconSize[size] || 32}
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3761 22C13.2363 22.0008 13.0978 21.9733 12.9684 21.919C12.839 21.8648 12.7213 21.7848 12.6221 21.6837L7.31231 16.2312C7.2133 16.1296 7.13475 16.0088 7.08117 15.876C7.02758 15.7431 7 15.6008 7 15.457C7 15.1666 7.11234 14.8881 7.31231 14.6827C7.51228 14.4774 7.7835 14.362 8.0663 14.362C8.3491 14.362 8.62032 14.4774 8.82029 14.6827L13.3761 19.3719L22.1797 10.3207C22.3797 10.1154 22.6509 10 22.9337 10C23.2165 10 23.4877 10.1154 23.6877 10.3207C23.8877 10.5261 24 10.8046 24 11.095C24 11.3854 23.8877 11.6639 23.6877 11.8692L14.1301 21.6837C14.0308 21.7848 13.9132 21.8648 13.7838 21.919C13.6544 21.9733 13.5158 22.0008 13.3761 22Z"
        fill="#575757"
      />
      <circle cx="16" cy="16" r="15" stroke="#575757" strokeWidth="2" />
    </svg>
  );
};

export default CheckIcon;
