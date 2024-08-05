import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const CourseIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 40}
      height={IconSize[size] || 33}
      className={className}
      viewBox="0 0 40 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38 14.2034L21 18.2712V32L33 27.4237L38 14.2034Z"
        fill="#4E4E4E"
        stroke="#4E4E4E"
      />
      <path
        d="M2 14.2034L19 18.2712V32L7 27.4237L2 14.2034Z"
        fill="#4E4E4E"
        stroke="#4E4E4E"
      />
      <path
        d="M39 9.11865L21.5 16.2373L38.5 12.1695L39 9.11865Z"
        fill="#37A69F"
        stroke="#37A69F"
      />
      <path
        d="M1 9.11865L18.5 16.2373L1.5 12.1695L1 9.11865Z"
        fill="#37A69F"
        stroke="#37A69F"
      />
      <path
        d="M36.5 5.05078L22 14.2033L36.4615 8.10163L36.5 5.05078Z"
        fill="#2EC269"
        stroke="#2EC269"
      />
      <path
        d="M3.5 5.05078L18 14.2033L3.53846 8.10163L3.5 5.05078Z"
        fill="#2EC269"
        stroke="#2EC269"
      />
      <path
        d="M33.5 2L22.5 12.1695L33.5 5.05085V2Z"
        fill="#C1BA13"
        stroke="#C1BA13"
      />
      <path
        d="M6.5 2L17.5 12.1695L6.5 5.05085V2Z"
        fill="#C1BA13"
        stroke="#C1BA13"
      />
    </svg>
  );
};

export default CourseIcon;
