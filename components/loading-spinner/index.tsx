import type { FunctionComponent } from "react";

interface IProps {}

const LoadingSpinner: FunctionComponent<IProps> = () => {
  return (
    <img
      className="loading-spinner"
      src="/assets/gifs/loading-spinner.gif"
      alt=""
    />
  );
};

export default LoadingSpinner;
