import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}
const SecurityIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 14}
      height={IconSize[size] || 17}
      className={className}
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 0L0 3.09091V7.72727C0 12.0159 2.98667 16.0264 7 17C11.0133 16.0264 14 12.0159 14 7.72727V3.09091L7 0ZM7 8.49227H12.4444C12.0322 11.6759 9.89333 14.5118 7 15.4005V8.5H1.55556V4.09545L7 1.69227V8.49227Z"
        fill="#353535"
        fillOpacity="0.62"
      />
    </svg>
  );
};

export default SecurityIcon;
