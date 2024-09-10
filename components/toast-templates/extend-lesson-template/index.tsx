import TimeoutLine from "@/components/timeout-line";
import type { FunctionComponent } from "react";

interface Props {
  duration: number;
  onExtendClick: () => void;
}
const ExtendLessonTemplate: FunctionComponent<Props> = ({
  duration,
  onExtendClick,
}) => {
  return (
    <div className="max-w-md w-80 pointer-events-auto flex">
      <div className="flex-1">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {/* Custom Icon */}
            <svg
              className="h-6 w-6 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m0 0V9h1l.867-2.598A1 1 0 0113 6h1a1 1 0 01.933.598L15 9h1m-3 7v1m-1-1v1m4-2h-4m4 0v-2m0 4v-2m0-4V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h4v4l3-3h6a2 2 0 002-2V5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-md font-bold text-gray-900">
              This lesson ends soon
            </p>
            <p className="mt-1 text-sm text-neutral-600 mb-3">
              Do you wish to{" "}
              <span
                className="text-link cursor-pointer"
                onClick={onExtendClick}
              >
                extend
              </span>{" "}
              it?
            </p>
            <TimeoutLine duration={duration} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExtendLessonTemplate;
