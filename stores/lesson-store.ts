"use client";

import type { getLesson } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { createStore } from "zustand";

export interface LessonState {
  lesson: ResultOf<typeof getLesson>;
  isEnded: boolean;
  isOngoing: boolean;
  setLesson: (lesson: LessonState["lesson"]) => void;
  setisEnded: (isEnded: boolean) => void;
  setisOngoing: (isOngoing: boolean) => void;
}

export type LessonStore = ReturnType<typeof createLessonStore>;

export const createLessonStore = (initLesson: LessonState["lesson"]) => {
  return createStore<LessonState>()((set) => ({
    lesson: initLesson,
    isEnded: isLessonEnded(initLesson),
    isOngoing: isLessonOngoing(initLesson),
    setLesson: (lesson: LessonState["lesson"]) =>
      set({
        lesson,
        ...(lesson
          ? {
              isOngoing: isLessonOngoing(lesson),
              isEnded: isLessonEnded(lesson),
            }
          : {}),
      }),
    setisEnded: (isEnded) => set({ isEnded }),
    setisOngoing: (isOngoing) => set({ isOngoing }),
  }));
};
