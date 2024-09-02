import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const Skeleton: FunctionComponent<Props> = ({ className }) => {
  return (
    <div>
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default Skeleton;
