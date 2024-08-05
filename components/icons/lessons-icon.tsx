import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}
const LessonsIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 14}
      height={IconSize[size] || 16}
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.375 2.625C4.375 1.92881 4.65156 1.26113 5.14384 0.768845C5.63613 0.276562 6.30381 0 7 0C7.69619 0 8.36387 0.276562 8.85616 0.768845C9.34844 1.26113 9.625 1.92881 9.625 2.625C9.625 3.32119 9.34844 3.98887 8.85616 4.48116C8.36387 4.97344 7.69619 5.25 7 5.25C6.30381 5.25 5.63613 4.97344 5.14384 4.48116C4.65156 3.98887 4.375 3.32119 4.375 2.625ZM6.5625 6.78125V14L5.23906 13.3383C4.66758 13.0539 4.04961 12.8734 3.4125 12.8105L0.7875 12.548C0.341797 12.5016 0 12.127 0 11.6758V6.125C0 5.64102 0.391016 5.25 0.875 5.25H1.70352C3.44258 5.25 5.13789 5.78594 6.5625 6.78125ZM7.4375 14V6.78125C8.86211 5.78594 10.5574 5.25 12.2965 5.25H13.125C13.609 5.25 14 5.64102 14 6.125V11.6758C14 12.1242 13.6582 12.5016 13.2125 12.5453L10.5875 12.8078C9.95312 12.8707 9.33242 13.0512 8.76094 13.3355L7.4375 14Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LessonsIcon;
