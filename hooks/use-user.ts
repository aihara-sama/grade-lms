"use client";

import { UserContext } from "@/contexts/user-context";
// import { UserContext } from "@/components/user-provider";
import type { UserState } from "@/stores/user-store";
// Mimic the hook returned by `create`
import { useContext } from "react";
import { useStore } from "zustand";

export const useUser = <T>(selector?: (state: UserState) => T): T => {
  // Hooks
  const store = useContext(UserContext);

  return useStore(store, selector);
};
