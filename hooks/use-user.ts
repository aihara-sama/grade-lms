"use client";

import type { User } from "@/types/users";
import { create } from "zustand";

export const useUser = create<{
  user: User;
  setUser: (user: User) => void;
}>((set) => ({
  user: null,
  setUser: (user: User) => {
    return set({ user });
  },
}));
