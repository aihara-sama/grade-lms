import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const DeleteIcon: FunctionComponent<Props> = ({ className }) => {
  return (
    <svg
      width="14"
      height="16"
      className={className}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.2 2.75457H4.7V2.25457V1.49093C4.7 1.30349 4.82961 1.22729 4.9 1.22729H9.1C9.1704 1.22729 9.3 1.30348 9.3 1.49093V2.25457V2.75457H9.8H13.3C13.3704 2.75457 13.5 2.83076 13.5 3.0182V3.78184C13.5 3.96929 13.3704 4.04548 13.3 4.04548H0.7C0.62961 4.04548 0.5 3.96928 0.5 3.78184V3.0182C0.5 2.83076 0.62961 2.75457 0.7 2.75457H4.2Z"
        fill="white"
        stroke="#575757"
      />
      <path
        d="M2.43957 14.135L1.81453 6.31812H12.1859L11.5609 14.135C11.5609 14.135 11.5609 14.135 11.5609 14.135C11.5018 14.8731 10.8234 15.4999 9.93782 15.4999H4.06265C3.17702 15.4999 2.49859 14.8731 2.43957 14.135Z"
        fill="white"
        stroke="#575757"
      />
    </svg>
  );
};

export default DeleteIcon;
