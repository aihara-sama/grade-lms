import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const NotificationsIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 22}
      height={IconSize[size] || 24}
      className={className}
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9737 18.1819L19.1273 16.7553C17.6653 14.4056 16.8958 11.6364 16.8958 8.78325C16.8958 5.76227 15.049 3.32871 12.5867 2.48955C12.3559 1.7343 11.6633 1.2308 10.8939 1.2308C10.1244 1.2308 9.43185 1.7343 9.20101 2.48955C6.73868 3.32871 4.89193 5.76227 4.89193 8.78325C4.89193 11.6364 4.12245 14.4056 2.66045 16.7553L1.81402 18.1819C1.42928 18.8532 1.81402 19.6923 2.5835 19.6923H19.2042C19.9737 19.6923 20.3584 18.8532 19.9737 18.1819Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9722 19.6923C13.9722 21.3846 12.5876 22.7693 10.8953 22.7693C9.20297 22.7693 7.81836 21.3846 7.81836 19.6923"
        fill="white"
      />
      <path
        d="M13.9722 19.6923C13.9722 21.3846 12.5876 22.7693 10.8953 22.7693C9.20297 22.7693 7.81836 21.3846 7.81836 19.6923"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NotificationsIcon;
