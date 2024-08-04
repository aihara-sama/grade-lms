"use client";

import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import type { FunctionComponent } from "react";

interface IProps {
  children: React.ReactNode;
}

const ContentWrapper: FunctionComponent<IProps> = ({ children }) => {
  const { isExpanded } = useIsLessonHrExpanded();
  return (
    <div
      className={`page-wrapper ${isExpanded ? "[max-width:unset] [margin:unset]" : ""}`}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
