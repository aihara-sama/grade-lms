"use client";

import { create } from "zustand";

export const useIsLessonHrExpanded = create<{
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}>((set) => ({
  isExpanded: false,
  setIsExpanded: (isExpanded: boolean) => {
    // localStorage.setItem("userName", userName);
    return set({ isExpanded });
  },
}));
