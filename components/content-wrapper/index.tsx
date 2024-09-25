import clsx from "clsx";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  fullWidth?: boolean;
}

const ContentWrapper: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  fullWidth = false,
}) => {
  return (
    <div
      id="content-wrapper"
      className="overflow-auto h-[calc(100vh-68px)] flex flex-col fixed inset-0 top-[68px]"
    >
      <div
        className={`max-w-[1432px] [@media(min-width:1432px)]:mx-[auto] ${clsx(fullWidth && "[max-width:unset] [margin:unset]")} w-full flex flex-1 flex-col p-6`}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;
