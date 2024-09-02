import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const SearchIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 18}
      height={IconSize[size] || 18}
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.77376 2C4.10159 2 1.93536 4.23859 1.93536 7.00001C1.93536 9.76141 4.10159 12 6.77376 12C8.11012 12 9.31837 11.4415 10.195 10.5355C11.0717 9.62961 11.6122 8.38101 11.6122 7.00001C11.6122 4.23859 9.44591 2 6.77376 2ZM0 7.00001C0 3.13401 3.03272 0 6.77376 0C10.5148 0 13.5475 3.13401 13.5475 7.00001C13.5475 8.57191 13.0453 10.0239 12.1989 11.1921L17.1348 16.2929C17.5127 16.6834 17.5127 17.3166 17.1348 17.7071C16.7569 18.0976 16.1442 18.0976 15.7663 17.7071L10.8304 12.6063C9.69992 13.481 8.29485 14 6.77376 14C3.03272 14 0 10.866 0 7.00001Z"
        fill="#555555"
      />
    </svg>
  );
};

export default SearchIcon;
