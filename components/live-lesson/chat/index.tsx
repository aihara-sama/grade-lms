"use client";

import AttachIcon from "@/components/icons/attach-icon";
import Input from "@/components/input";

import CreateFileMessageModal from "@/components/common/modals/create-file-message-modal";
import MessagesIcon from "@/components/icons/messages-icon";
import Message from "@/components/live-lesson/chat/message";
import { createChatMessage, getChatMessages } from "@/db/message";
import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types";
import type { ChatMessage } from "@/types/chat-messages";
import type { Course } from "@/types/courses.type";
import { Event } from "@/types/events.type";
import type { Lesson } from "@/types/lessons.type";
import { isLessonEnded } from "@/utils/is-lesson-ended";
import clsx from "clsx";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  lesson: Lesson & { course: Course };
}

const Chat: FunctionComponent<IProps> = ({ lesson }) => {
  // State
  const [chatMessageText, setChatMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<
    ResultOf<typeof getChatMessages>
  >([]);
  const [file, setFile] = useState<File>();
  const [isCreateFileMessageModalOpen, setIsCreateFileMessageModalOpen] =
    useState(false);

  // Refs
  const messagesWrapperRef = useRef<HTMLDivElement>();

  // Hooks
  const { user } = useUser();
  const channel = useLessonChannel();

  const disabled = isLessonEnded(new Date(lesson.ends));

  // Handlers
  const fireChatMessageCreate = (chatMessage: ChatMessage) => {
    channel.send({
      event: Event.ChatMessageCreated,
      type: "broadcast",
      payload: chatMessage,
    });
  };
  const submitCreateChatMesssage = async (replyId?: string) => {
    try {
      const createdChatMessage = await createChatMessage({
        text: chatMessageText,
        author: user.name,
        lesson_id: lesson.id,
        reply_id: replyId,
        author_avatar: user.avatar,
        author_role: user.role,
      });

      setChatMessageText("");
      fireChatMessageCreate(createdChatMessage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchChatMessages = async () => {
    try {
      setChatMessages(await getChatMessages(lesson.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onNewChatMessage = (payload: {
    payload: ResultOf<typeof getChatMessages>[number];
  }) => setChatMessages((prev) => [...prev, payload.payload]);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setIsCreateFileMessageModalOpen(true);
    }
  };
  // Effects
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    messagesWrapperRef.current.scrollTo(
      0,
      messagesWrapperRef.current.scrollHeight
    );
  }, [chatMessages]);

  useEffect(() => {
    channel.on<ResultOf<typeof getChatMessages>[number]>(
      "broadcast",
      { event: Event.ChatMessageCreated },
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
        disabled={disabled}
        className="mt-auto"
        fullWIdth
        onChange={(e) => setChatMessageText(e.target.value)}
        value={chatMessageText}
        Icon={
          <label>
            <AttachIcon className={`${clsx(disabled || "interactive")}`} />
            {!disabled && (
              <input onChange={onFileChange} type="file" className="hidden" />
            )}
          </label>
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitCreateChatMesssage();
          }
        }}
      />
      <CreateFileMessageModal
        file={file}
        isOpen={isCreateFileMessageModalOpen}
        lessonId={lesson.id}
        onDone={fetchChatMessages}
        setIsOpen={setIsCreateFileMessageModalOpen}
      />
    </div>
  );
};

export default Chat;
