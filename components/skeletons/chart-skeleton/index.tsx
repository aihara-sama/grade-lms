import type { FunctionComponent } from "react";

interface Props {
  record: string;
}

const ChartSkeleton: FunctionComponent<Props> = ({ record }) => {
  return (
    <>
      <div className="relative flex border border-neutral-100 p-[11px]">
        <div className="bg-[url(/chart-skeleton.svg)] h-[276px] w-[100%] bg-contain bg-no-repeat bg-center"></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-filter backdrop-blur-[1px] z-[99] bg-neutral-300/25"></div>
        <div className="absolute rounded-lg text-neutral-500 z-[99] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-neutral-200 bg-gray-100 px-3 py-2 text-sm">
          <p className="whitespace-nowrap">
            <span className="text-yellow-500">{record}</span> data will be shown
            here
          </p>
        </div>
      </div>
    </>
  );
};

export default ChartSkeleton;
