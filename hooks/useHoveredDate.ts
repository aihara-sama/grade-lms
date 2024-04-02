"use client";

import { create } from "zustand";

export const useHoveredDate = create<{
  hoveredDate: string;
  setHoveredDate: (hoveredDate: string) => void;
}>((set) => ({
  hoveredDate: "",
  setHoveredDate: (hoveredDate) => {
    return set({ hoveredDate });
  },
}));
