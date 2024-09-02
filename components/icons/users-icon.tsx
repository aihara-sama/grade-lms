import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const UsersIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 14}
      height={IconSize[size] || 12}
      className={className}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.08318 0C3.46436 0 2.87089 0.286793 2.43332 0.797288C1.99576 1.30778 1.74993 2.00016 1.74993 2.72211C1.74993 3.44406 1.99576 4.13644 2.43332 4.64694C2.87089 5.15743 3.46436 5.44422 4.08318 5.44422C4.70199 5.44422 5.29546 5.15743 5.73303 4.64694C6.1706 4.13644 6.41642 3.44406 6.41642 2.72211C6.41642 2.00016 6.1706 1.30778 5.73303 0.797288C5.29546 0.286793 4.70199 0 4.08318 0ZM2.91655 2.72211C2.91655 2.90085 2.94673 3.07783 3.00536 3.24297C3.06399 3.4081 3.14992 3.55814 3.25825 3.68452C3.36658 3.81091 3.49519 3.91116 3.63673 3.97956C3.77827 4.04796 3.92997 4.08317 4.08318 4.08317C4.23638 4.08317 4.38808 4.04796 4.52962 3.97956C4.67116 3.91116 4.79977 3.81091 4.9081 3.68452C5.01643 3.55814 5.10237 3.4081 5.16099 3.24297C5.21962 3.07783 5.2498 2.90085 5.2498 2.72211C5.2498 2.36114 5.12689 2.01495 4.9081 1.7597C4.68932 1.50445 4.39258 1.36106 4.08318 1.36106C3.77377 1.36106 3.47703 1.50445 3.25825 1.7597C3.03947 2.01495 2.91655 2.36114 2.91655 2.72211ZM1.31439 7.32248C2.06103 6.82343 3.04099 6.57844 4.08318 6.57844C5.12536 6.57844 6.10532 6.82343 6.85196 7.32248C7.61415 7.83061 8.16635 8.65632 8.16635 9.75423C8.16635 10.3894 7.94858 10.9338 7.55971 11.3058C7.18639 11.6597 6.70419 11.7958 6.22198 11.7958H1.94437C1.46994 11.7958 0.979962 11.6597 0.606643 11.3058C0.217769 10.9429 0 10.3985 0 9.75423C0 8.65632 0.552201 7.83061 1.31439 7.32248ZM1.8977 8.50206C1.39217 8.83779 1.16662 9.26425 1.16662 9.75423C1.16662 10.0264 1.2444 10.1535 1.33773 10.2442C1.44661 10.344 1.64883 10.4348 1.94437 10.4348H6.22198C6.5253 10.4348 6.71974 10.344 6.82863 10.2442C6.92196 10.1535 6.99973 10.0174 6.99973 9.75423C6.99973 9.26425 6.77418 8.84686 6.26865 8.50206C5.75533 8.14819 4.98536 7.93949 4.08318 7.93949C3.18099 7.93949 2.41102 8.14819 1.8977 8.50206ZM9.91628 0C9.29747 0 8.704 0.286793 8.26643 0.797288C7.82886 1.30778 7.58304 2.00016 7.58304 2.72211C7.58304 3.44406 7.82886 4.13644 8.26643 4.64694C8.704 5.15743 9.29747 5.44422 9.91628 5.44422C10.5351 5.44422 11.1286 5.15743 11.5661 4.64694C12.0037 4.13644 12.2495 3.44406 12.2495 2.72211C12.2495 2.00016 12.0037 1.30778 11.5661 0.797288C11.1286 0.286793 10.5351 0 9.91628 0ZM8.74966 2.72211C8.74966 3.08309 8.87257 3.42928 9.09136 3.68452C9.31014 3.93977 9.60688 4.08317 9.91628 4.08317C10.2257 4.08317 10.5224 3.93977 10.7412 3.68452C10.96 3.42928 11.0829 3.08309 11.0829 2.72211C11.0829 2.36114 10.96 2.01495 10.7412 1.7597C10.5224 1.50445 10.2257 1.36106 9.91628 1.36106C9.60688 1.36106 9.31014 1.50445 9.09136 1.7597C8.87257 2.01495 8.74966 2.36114 8.74966 2.72211Z"
        fill="currentColor"
      />
      <path
        d="M9.91685 7.93942C9.73797 7.93942 9.56687 7.9485 9.38798 7.96665C9.3091 7.98163 9.22841 7.97754 9.15093 7.95463C9.07346 7.93172 9.00084 7.89048 8.9376 7.83347C8.87435 7.77645 8.82182 7.70488 8.78327 7.6232C8.74472 7.54152 8.72097 7.45146 8.7135 7.35862C8.70602 7.26579 8.71497 7.17215 8.73981 7.08351C8.76464 6.99488 8.80482 6.91315 8.85786 6.84339C8.9109 6.77363 8.97565 6.71733 9.04812 6.67798C9.12058 6.63864 9.1992 6.61709 9.2791 6.61466C9.48909 6.58744 9.69908 6.57837 9.91685 6.57837C10.959 6.57837 11.939 6.82336 12.6856 7.32241C13.4478 7.83054 14 8.65625 14 9.75417C14 10.3893 13.7823 10.9337 13.3934 11.3058C13.0201 11.6596 12.5379 11.7957 12.0557 11.7957H9.72242C9.56771 11.7957 9.41934 11.7241 9.30995 11.5964C9.20056 11.4688 9.1391 11.2957 9.1391 11.1152C9.1391 10.9347 9.20056 10.7616 9.30995 10.634C9.41934 10.5064 9.56771 10.4347 9.72242 10.4347H12.0557C12.359 10.4347 12.5534 10.344 12.6623 10.2441C12.7556 10.1534 12.8334 10.0173 12.8334 9.75417C12.8334 9.26419 12.6079 8.8468 12.1023 8.50199C11.4262 8.10215 10.6744 7.90861 9.91685 7.93942Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default UsersIcon;
