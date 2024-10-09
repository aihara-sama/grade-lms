import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const LoadingSpinner: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  return (
    <img
      className={`loading-spinner ${className}`}
      src="/assets/gif/loading-spinner.gif"
      alt=""
    />
  );
};

export default LoadingSpinner;
