"use client";

import { getChatMessages } from "@/db/chat-message";
import { Event } from "@/enums/event.enum";
import { useChat } from "@/hooks/use-chat";
import { useChatChannel } from "@/hooks/use-chat-channel";
import type { ResultOf } from "@/types/utils.type";
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
    if (!channel.joinedOnce)
      channel
        .on<
          ResultOf<typeof getChatMessages>[number]
        >("broadcast", { event: Event.ChatMessageCreated }, onNewChatMessage)
        .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return children;
};

export default ChatProvider;
