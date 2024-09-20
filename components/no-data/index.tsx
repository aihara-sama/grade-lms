import NoDataIcon from "@/components/icons/no-data-icon";
import type { FunctionComponent } from "react";

interface IProps {}

const NoData: FunctionComponent<IProps> = () => {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col items-center">
        <NoDataIcon />
        <p className="mt-4 font-bold">View your work in a list</p>
      </div>
    </div>
  );
};

export default NoData;
