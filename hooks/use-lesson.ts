// Mimic the hook returned by `create`
import { LessonContext } from "@/contexts/lesson-context";
import type { LessonState } from "@/stores/lesson-store";
import { useContext } from "react";
import { useStore } from "zustand";

export const useLesson = <T>(selector?: (state: LessonState) => T): T => {
  const store = useContext(LessonContext);

  return useStore(store, selector);
};
