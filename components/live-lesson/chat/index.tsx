"use client";

import AttachIcon from "@/components/icons/attach-icon";
import Input from "@/components/input";
import { useEffect, useRef, useState, type FunctionComponent } from "react";

import MessagesIcon from "@/components/icons/messages-icon";
import Message from "@/components/live-lesson/chat/message";
import { createChatMessage, getChatMessages } from "@/db/message";
import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types";
import type { ChatMessage } from "@/types/chat-messages";
import { Event } from "@/types/events.type";
import clsx from "clsx";
import toast from "react-hot-toast";

interface IProps {
  lessonId: string;
}

const Chat: FunctionComponent<IProps> = ({ lessonId }) => {
  // State
  const [chatMessageText, setChatMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<
    ResultOf<typeof getChatMessages>
  >([]);

  // Refs
  const messagesWrapperRef = useRef<HTMLDivElement>();

  // Hooks
  const { user } = useUser();
  const channel = useLessonChannel();

  // Handlers
  const handleCreateChatMesssage = async (replyId?: string) => {
    try {
      const createdChatMessage = await createChatMessage({
        text: chatMessageText,
        author: user.name,
        lesson_id: lessonId,
        reply_id: replyId,
        author_avatar: user.avatar,
        author_role: user.role,
      });

      setChatMessages((prev) => [...prev, createdChatMessage]);
      setChatMessageText("");
      channel.send({
        event: Event.ChatMessage,
        type: "broadcast",
        payload: createdChatMessage,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleGetMessages = async () => {
    try {
      setChatMessages(await getChatMessages(lessonId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onNewChatMessage = (payload: { payload: ChatMessage }) =>
    setChatMessages((prev) => [...prev, payload.payload]);

  // Effects
  useEffect(() => {
    handleGetMessages();
  }, []);
  useEffect(() => {
    messagesWrapperRef.current.scrollTo(
      0,
      messagesWrapperRef.current.scrollHeight
    );
  }, [chatMessages]);
  useEffect(() => {
    channel.on<ChatMessage>(
      "broadcast",
      { event: Event.ChatMessage },
      onNewChatMessage
    );
  }, []);

  return (
    <div className="rounded-md relative px-4 py-0 pb-4 flex-1 flex flex-col border border-gray-200">
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-2">
          <MessagesIcon size="xs" />
          <p className="text-lg font-bold text-center">Chat</p>
        </div>
      </div>
      <hr />
      <div
        style={{
          maxHeight: `${typeof window !== "undefined" ? window.innerHeight - 380 : 0}px`,
        }}
        ref={messagesWrapperRef}
        className="flex-1 flex flex-col overflow-y-auto mb-3 mt-3 pr-1"
      >
        <div className="flex flex-1 flex-col gap-2">
          {chatMessages.map((msg, idx) => (
            <div key={msg.id} className={`${clsx(idx === 0 && "mt-auto")}`}>
              <Message chatMessage={msg} />
            </div>
          ))}
        </div>
      </div>
      <Input
        className="mt-auto"
        fullWIdth
        onChange={(e) => setChatMessageText(e.target.value)}
        value={chatMessageText}
        Icon={<AttachIcon />}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateChatMesssage();
          }
        }}
      />
    </div>
  );
};

export default Chat;
