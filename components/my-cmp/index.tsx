"use client";

import { useChat } from "@/hooks/use-chat";
import type { FunctionComponent, PropsWithChildren } from "react";

const MyCmp: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { messages } = useChat();
  console.log({ messages });

  return <div>cmp server {children} </div>;
};

export default MyCmp;
