import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const TimeIcon: FunctionComponent<Props> = ({ className, size }) => {
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
        d="M8.07619 7.25292L9.87303 8.29032C10.0484 8.39158 10.1052 8.62169 10.0064 8.79275C9.90467 8.96896 9.6851 9.03265 9.50461 8.92844L7.67733 7.87347C7.49024 8.01876 7.25522 8.10526 7 8.10526C6.38958 8.10526 5.89474 7.61042 5.89474 7C5.89474 6.51876 6.2023 6.10936 6.63158 5.95763V2.58147C6.63158 2.3766 6.80248 2.21053 7 2.21053C7.20347 2.21053 7.36842 2.38214 7.36842 2.58147V5.95763C7.7977 6.10936 8.10526 6.51876 8.10526 7C8.10526 7.08702 8.0952 7.17169 8.07619 7.25292ZM7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM7 13.2632C10.459 13.2632 13.2632 10.459 13.2632 7C13.2632 3.54095 10.459 0.736842 7 0.736842C3.54095 0.736842 0.736842 3.54095 0.736842 7C0.736842 10.459 3.54095 13.2632 7 13.2632Z"
        fill="#676767"
      />
    </svg>
  );
};

export default TimeIcon;
