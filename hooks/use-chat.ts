"use client";

import type { getChatMessages } from "@/db/message";
import type { ResultOf } from "@/types";
import { create } from "zustand";

interface Store {
  messages: ResultOf<typeof getChatMessages>;
  setMessages: (fn: (prev: Store["messages"]) => Store["messages"]) => void;
}
export const useChat = create<Store>((set) => ({
  messages: [],
  setMessages: (fn) => {
    set((state) => ({ messages: fn(state.messages) }));
  },
}));
