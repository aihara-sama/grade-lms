"use client";

import { create } from "zustand";

export const useUserName = create<{
  userName: string | null;
  setUserName: (userName: string) => void;
}>((set) => ({
  userName: null,
  setUserName: (userName: string) => {
    localStorage.setItem("userName", userName);
    return set({ userName });
  },
}));
