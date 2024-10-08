import type { FunctionComponent } from "react";

interface Props {
  duration: number;
}

const TimeoutLine: FunctionComponent<Props> = ({ duration }) => {
  return (
    <div className="relative w-full h-2 bg-gray-300">
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 animate-timeout-line"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default TimeoutLine;
