import type { FunctionComponent } from "react";
import { IconSize } from ".";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const CameraIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 14}
      height={IconSize[size] || 13}
      className={className}
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.00006 10.182C8.75731 10.182 10.1819 8.75743 10.1819 7.00018C10.1819 5.24292 8.75731 3.81836 7.00006 3.81836C5.24279 3.81836 3.81824 5.24292 3.81824 7.00018C3.81824 8.75743 5.24279 10.182 7.00006 10.182ZM7.00006 8.91379C5.94318 8.91379 5.08645 8.05705 5.08645 7.00018C5.08645 5.9433 5.94318 5.08657 7.00006 5.08657C8.05693 5.08657 8.91366 5.9433 8.91366 7.00018C8.91366 8.05705 8.05693 8.91379 7.00006 8.91379Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.44826 0C4.57224 0 3.80864 0.596203 3.59617 1.44607L3.32132 2.54545H1.90909C0.854732 2.54545 0 3.40019 0 4.45455V10.8182C0 11.8726 0.854732 12.7273 1.90909 12.7273H12.0909C13.1453 12.7273 14 11.8726 14 10.8182V4.45455C14 3.40019 13.1453 2.54545 12.0909 2.54545H10.6787L10.4038 1.44607C10.1914 0.596203 9.42779 0 8.55171 0H5.44826ZM4.8309 1.75475C4.90172 1.47146 5.15625 1.27273 5.44826 1.27273H8.55171C8.84374 1.27273 9.09828 1.47146 9.16911 1.75475L9.44395 2.85414C9.58561 3.42072 10.0946 3.81818 10.6787 3.81818H12.0909C12.4424 3.81818 12.7273 4.10309 12.7273 4.45455V10.8182C12.7273 11.1696 12.4424 11.4545 12.0909 11.4545H1.90909C1.55764 11.4545 1.27273 11.1696 1.27273 10.8182V4.45455C1.27273 4.10309 1.55764 3.81818 1.90909 3.81818H3.32132C3.90534 3.81818 4.4144 3.42072 4.55605 2.85414L4.8309 1.75475Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CameraIcon;
