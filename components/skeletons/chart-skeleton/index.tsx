import type { FunctionComponent } from "react";

interface Props {
  record: string;
}

const ChartSkeleton: FunctionComponent<Props> = ({ record }) => {
  return (
    <>
      <div className="z-[98] relative flex border border-neutral-100 p-[11px]">
        <div className="bg-[url(/assets/svg/chart-skeleton.svg)] h-[276px] w-[100%] bg-contain bg-no-repeat bg-center flex items-center justify-center">
          <div className="z-[99] rounded-lg text-neutral-500 border border-neutral-200 bg-gray-100 px-3 py-2 text-sm relative">
            <p className="whitespace-nowrap">
              <span className="text-yellow-500">{record}</span> data will show
              here
            </p>
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-filter backdrop-blur-[1px] z-[9] bg-neutral-300/25"></div>
      </div>
    </>
  );
};

export default ChartSkeleton;
