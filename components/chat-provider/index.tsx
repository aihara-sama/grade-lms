"use client";

import { getChatMessages } from "@/db/message";
import { useChat } from "@/hooks/use-chat";
import { useChatChannel } from "@/hooks/use-chat-channel";
import type { ResultOf } from "@/types";
import { Event } from "@/types/events.type";
import { REALTIME_CHANNEL_STATES } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ChatProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const channel = useChatChannel();
  const { lessonId } = useParams();

  const { setMessages } = useChat();

  const onNewChatMessage = (payload: {
    payload: ResultOf<typeof getChatMessages>[number];
  }) => {
    setMessages((prev) => [...prev, payload.payload]);
    console.log("onNewChatMessage");
  };

  const fetchChatMessages = async () => {
    try {
      const fetchedMessages = await getChatMessages(lessonId as string);

      setMessages(() => fetchedMessages);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (channel.state === REALTIME_CHANNEL_STATES.joined)
      channel
        .on<
          ResultOf<typeof getChatMessages>[number]
        >("broadcast", { event: Event.ChatMessageCreated }, onNewChatMessage)
        .subscribe();
  }, []);

  return children;
};

export default ChatProvider;
