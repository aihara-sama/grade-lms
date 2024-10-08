import type { FunctionComponent } from "react";

interface IProps {}

const LoadingSpinner: FunctionComponent<IProps> = () => {
  return (
    <img
      className="loading-spinner"
      src="/assets/gif/loading-spinner.gif"
      alt=""
    />
  );
};

export default LoadingSpinner;
