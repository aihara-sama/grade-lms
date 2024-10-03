"use client";

import type { User } from "@/types/user.type";
import { createStore } from "zustand";

export interface UserState {
  user: User;
  setUser: (user: User) => void;
}

export type UserStore = ReturnType<typeof createUserStore>;

export const createUserStore = (initUser: User | null) => {
  return createStore<UserState>()((set) => ({
    user: initUser,
    setUser: (user: User) => set({ user }),
  }));
};
