"use client";

import type { Lesson } from "@/types/lessons.type";
import { create } from "zustand";

interface Store {
  lesson: Lesson;
  setLesson: (lesson: Lesson) => void;
  isEnded: boolean;
  setisEnded: (isEnded: boolean) => void;
  isOngoing: boolean;
  setisOngoing: (isOngoing: boolean) => void;
}
export const useLesson = create<Store>((set) => ({
  lesson: null,
  isEnded: false,
  isOngoing: false,
  setLesson: (lesson: Lesson) => set({ lesson }),
  setisEnded: (isEnded) => set({ isEnded }),
  setisOngoing: (isOngoing) => set({ isOngoing }),
}));
