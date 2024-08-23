"use client";

import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import clsx from "clsx";
import type { FunctionComponent } from "react";

interface IProps {
  children: React.ReactNode;
}

const ContentWrapper: FunctionComponent<IProps> = ({ children }) => {
  const { isExpanded } = useIsLessonHrExpanded();
  return (
    <div
      className={`overflow-auto h-[calc(100vh-68px)] fixed inset-0 top-[68px] `}
    >
      <div
        className={`max-w-[1432px] mx-[auto] ${clsx(isExpanded && "[max-width:unset] [margin:unset]")} flex flex-1 flex-col p-6`}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;
