// Mimic the hook returned by `create`
import { CourseContext } from "@/components/course-provider";
import type { CourseState } from "@/stores/course-store";
import { useContext } from "react";
import { useStore } from "zustand";

export const useCourse = <T>(selector?: (state: CourseState) => T): T => {
  const store = useContext(CourseContext);

  return useStore(store, selector);
};
