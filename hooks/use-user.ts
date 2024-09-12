"use client";

import type { User } from "@/types/users";
import { create } from "zustand";

interface Store {
  user: User;
  setUser: (user: User) => void;
}
export const useUser = create<Store>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
