import NotFoundIcon from "@/components/icons/not-found-icon";
import type { FunctionComponent } from "react";

interface IProps {}

const NotFound: FunctionComponent<IProps> = () => {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-col items-center">
        <NotFoundIcon />
        <p className="mt-4 font-bold">
          It looks like we can&apos;t find any results for that match
        </p>
      </div>
    </div>
  );
};

export default NotFound;
