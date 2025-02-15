"use client";

import type { getLesson } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { isLessonEnding } from "@/utils/lesson/is-lesson-ending";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { createStore } from "zustand";

export interface LessonState {
  lesson: ResultOf<typeof getLesson>;
  isEnding: boolean;
  isEnded: boolean;
  isOngoing: boolean;
  setLesson: (lesson: LessonState["lesson"]) => void;
  setIsEnding: (isEnding: boolean) => void;
  setIsEnded: (isEnded: boolean) => void;
  setIsOngoing: (isOngoing: boolean) => void;
}

export type LessonStore = ReturnType<typeof createLessonStore>;

export const createLessonStore = (initLesson: LessonState["lesson"]) => {
  return createStore<LessonState>()((set) => ({
    lesson: initLesson,
    isEnded: isLessonEnded(initLesson),
    isEnding: isLessonEnding(initLesson),
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
    setIsEnded: (isEnded) => set({ isEnded }),
    setIsEnding: (isEnding) => set({ isEnding }),
    setIsOngoing: (isOngoing) => set({ isOngoing }),
  }));
};
