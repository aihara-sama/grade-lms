"use client";

import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import type { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isExpanded } = useIsLessonHrExpanded();

  return (
    <div
      className={`page-wrapper ${isExpanded ? "[max-width:unset] [margin:unset]" : ""} `}
    >
      {children}
    </div>
  );
};

export default Layout;
