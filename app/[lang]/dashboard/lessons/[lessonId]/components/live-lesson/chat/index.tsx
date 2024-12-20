"use client";

import AttachIcon from "@/components/icons/attach-icon";

import Message from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/chat/message";
import BasicInput from "@/components/common/inputs/basic-input";
import CreateFileMessageModal from "@/components/common/modals/create-file-message-modal";
import ChatIcon from "@/components/icons/chat-icon";
import SendMessageIcon from "@/components/icons/send-message-icon";
import { createChatMessage, getChatMessages } from "@/db/client/chat-message";
import { Event } from "@/enums/event.enum";
import { useChat } from "@/hooks/use-chat";
import { useChatChannel } from "@/hooks/use-chat-channel";
import { useUser } from "@/hooks/use-user";
import type { ChatMessage } from "@/types/chat-message";
import type { Course } from "@/types/course.type";
import type { Lesson } from "@/types/lesson.type";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import clsx from "clsx";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  lesson: Lesson & { course: Course };
}

const Chat: FunctionComponent<Props> = ({ lesson }) => {
  // State
  const [chatMessageText, setChatMessageText] = useState("");
  const [file, setFile] = useState<File>();
  const [isCreateFileMessageModalOpen, setIsCreateFileMessageModalOpen] =
    useState(false);
  const { messages, setMessages } = useChat();

  // Refs
  const messagesWrapperRef = useRef<HTMLDivElement>();

  // Hooks
  const user = useUser((state) => state.user);
  const channel = useChatChannel();

  const disabled = isLessonEnded(lesson);

  // Handlers
  const fireChatMessageCreate = (chatMessage: ChatMessage) => {
    channel.send({
      event: Event.ChatMessageCreated,
      type: "broadcast",
      payload: chatMessage,
    });
  };

  const fetchChatMessages = async () => {
    try {
      const { data } = await getChatMessages(lesson.id);

      setMessages(() => data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitCreateChatMesssage = async (replyId?: string) => {
    try {
      const createdChatMessage = await createChatMessage({
        text: chatMessageText,
        lesson_id: lesson.id,
        reply_id: replyId,
        creator_id: user.id,
      });

      setChatMessageText("");
      setMessages((prev) => [...prev, createdChatMessage]);
      fireChatMessageCreate(createdChatMessage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setIsCreateFileMessageModalOpen(true);

      e.target.value = "";
    }
  };
  const onCreateFileMessageModalClose = (mutated?: boolean) => {
    setIsCreateFileMessageModalOpen(false);

    if (mutated) {
      fetchChatMessages();
    }
  };

  // Effects

  useEffect(() => {
    messagesWrapperRef.current.scrollTo(
      0,
      messagesWrapperRef.current.scrollHeight
    );
  }, [messages]);

  return (
    <div className="rounded-md relative px-4 py-0 pb-4 flex-1 flex flex-col border border-gray-200">
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-2">
          <ChatIcon size="sm" />
          <p className="text-lg font-bold text-center">Messages</p>
        </div>
      </div>
      <hr />
      <div
        ref={messagesWrapperRef}
        className="flex-1 flex flex-col overflow-y-auto mb-3 mt-3 pr-1 max-h-[calc(100vh-360px)]"
      >
        <div className="flex flex-1 flex-col gap-2">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`${clsx(idx === 0 && "mt-auto")}`}>
              <Message chatMessage={msg} />
            </div>
          ))}
        </div>
      </div>
      <BasicInput
        disabled={disabled}
        className="mt-auto"
        fullWidth
        onChange={(e) => setChatMessageText(e.target.value)}
        value={chatMessageText}
        StartIcon={
          <label>
            <AttachIcon className={`${clsx(disabled || "inter-active")}`} />
            {!disabled && (
              <input onChange={onFileChange} type="file" className="hidden" />
            )}
          </label>
        }
        EndIcon={
          <button
            disabled={!chatMessageText.length}
            className={`p-1 rounded-md bg-blue-200  ${clsx({
              "opacity-75 cursor-default": !chatMessageText.length,
              "cursor-pointer hover:bg-blue-300 active:bg-blue-600":
                chatMessageText.length,
            })}`}
            onClick={() => submitCreateChatMesssage()}
          >
            <SendMessageIcon size="xs" />
          </button>
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitCreateChatMesssage();
          }
        }}
      />
      {isCreateFileMessageModalOpen && (
        <CreateFileMessageModal
          file={file}
          lessonId={lesson.id}
          courseId={lesson.course_id}
          onClose={onCreateFileMessageModalClose}
        />
      )}
    </div>
  );
};

export default Chat;
