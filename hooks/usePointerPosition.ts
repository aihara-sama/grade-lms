"use client";

import { create } from "zustand";

export const usePointerPosition = create<{
  x: number;
  y: number;
  setPosition: (x: number, y: number) => void;
}>((set) => ({
  x: 0,
  y: 0,
  setPosition: (x: number, y: number) => {
    return set({ x, y });
  },
}));
