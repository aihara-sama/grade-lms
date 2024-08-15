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
      className={`mt-[68px] flex flex-1 flex-col p-6 max-w-[1432px] mx-[auto] ${clsx(isExpanded && "[max-width:unset] [margin:unset]")}`}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
