import type { FunctionComponent } from "react";

interface IProps {}

const Skeleton: FunctionComponent<IProps> = () => {
  return (
    <div>
      <div className="animate-pulse">
        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default Skeleton;
