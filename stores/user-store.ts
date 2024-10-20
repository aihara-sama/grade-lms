"use client";

import type { getProfile } from "@/db/server/user";
import type { ResultOf } from "@/types/utils.type";
import { createStore } from "zustand";

export interface UserState {
  user: ResultOf<typeof getProfile>;
  setUser: (user: ResultOf<typeof getProfile>) => void;
}

export type UserStore = ReturnType<typeof createUserStore>;

export const createUserStore = (
  initUser: ResultOf<typeof getProfile> | null
) => {
  return createStore<UserState>()((set) => ({
    user: initUser,
    setUser: (user: ResultOf<typeof getProfile>) => set({ user }),
  }));
};
