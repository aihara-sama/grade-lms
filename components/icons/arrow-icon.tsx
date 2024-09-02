import type { FunctionComponent } from "react";

interface Props {
  direction: "top" | "right" | "bottom" | "left";
  className?: string;
}

const directions = {
  top: 270,
  right: 0,
  bottom: 90,
  left: 180,
};

const ArrowIcon: FunctionComponent<Props> = ({
  className,
  direction = "right",
}) => {
  return (
    <svg
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon ${className}`}
      style={{
        transform: `rotate(${directions[direction]}deg)`,
        transition: `0.2s`,
      }}
    >
      <path
        d="M0.247642 9.77806C0.57382 10.074 1.10272 10.074 1.4289 9.77806L5.51126 6.07075C6.16312 5.47876 6.16287 4.51953 5.51076 3.92784L1.42589 0.221952C1.09971 -0.073984 0.570812 -0.073984 0.244634 0.221952C-0.0815446 0.517896 -0.0815446 0.997704 0.244634 1.29365L3.7408 4.4655C4.06706 4.7615 4.06706 5.24126 3.7408 5.53718L0.247642 8.70638C-0.0785367 9.0023 -0.0785367 9.48214 0.247642 9.77806Z"
        fill="#575757"
      />
    </svg>
  );
};

export default ArrowIcon;
