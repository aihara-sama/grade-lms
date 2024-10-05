import NoDataIcon from "@/components/icons/no-data-icon";
import type { FunctionComponent, ReactNode } from "react";

interface Props {
  body: string;
  action: ReactNode;
}

const NoData: FunctionComponent<Props> = ({ action, body }) => {
  return (
    <div className="flex justify-center min-h-[500px]">
      <div className="flex flex-col items-center">
        <NoDataIcon />
        <p className="mt-4 font-bold mb-2 text-xl">View your work in a list</p>
        <p className="text-sm text-neutral-500 max-w-96 mb-3">{body}</p>
        {action}
      </div>
    </div>
  );
};

export default NoData;
