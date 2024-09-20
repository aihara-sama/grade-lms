"use client";

import type { User } from "@/types/user.type";
import { create } from "zustand";

interface Store {
  user: User;
  setUser: (user: User) => void;
}
export const useUser = create<Store>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
