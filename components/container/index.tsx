import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import clsx from "clsx";
import type { PropsWithChildren, UIEventHandler } from "react";
import { forwardRef } from "react";

interface Props {
  onScrollEnd?: () => void;
  fullWidth?: boolean;
}

const Container = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function ContentWrapper({ children, fullWidth, onScrollEnd }, ref) {
    const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
      if (isCloseToBottom(e.target as HTMLElement)) onScrollEnd?.();
    };

    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className="overflow-auto h-[calc(100vh-68px)] flex flex-col"
      >
        <div
          className={` ${clsx(!fullWidth && "max-w-[1432px] [@media(min-width:1432px)]:mx-[auto]")} w-full flex flex-1 flex-col p-6`}
        >
          <div className="h-full flex flex-col">{children}</div>
        </div>
      </div>
    );
  }
);

export default Container;
