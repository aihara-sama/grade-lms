"use client";

import AttachIcon from "@/components/icons/attach-icon";
import BlockChatIcon from "@/components/icons/block-chat-icon";
import ClearIcon from "@/components/icons/clear-icon";
import PollIcon from "@/components/icons/poll-icon";
import Input from "@/components/input";
import Message from "@/components/lesson/chat/message";
import Poll from "@/components/lesson/chat/poll";
import CreatePollModal from "@/components/modals/create-poll-modal";
import { supabaseClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  lessonId: string;
  userName: string;
  channel: RealtimeChannel;
}

const Chat: FunctionComponent<IProps> = ({ lessonId, userName, channel }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      author: string;
      id: string;
      is_poll: boolean;
      lesson_id: string;
      reply_id: string;
      text: string;
      polls: {
        id: string;
        message_id: string;
        title: string;
        poll_options: {
          id: string;
          poll_id: string;
          title: string;
          votes: number;
        }[];
      }[];
    }[]
  >([]);
  const messagesRef = useRef<HTMLDivElement>();
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);

  const handleCreateMesssage = async (replyId?: string) => {
    const { error, data } = await supabaseClient
      .from("messages")
      .insert({
        text: message,
        author: userName,
        lesson_id: lessonId,
        reply_id: replyId,
      })
      .select("*, polls(*, poll_options(*))")
      .single();

    if (error) {
      toast(error.message);
    } else {
      setMessages((prev) => [...prev, data]);
      setMessage("");
      channel.send({
        event: "message",
        type: "broadcast",
        payload: {
          message: data,
        },
      });
    }
  };

  const getMessages = async () => {
    const data = await supabaseClient
      .from("messages")
      .select("*, polls(*, poll_options(*))")
      .eq("lesson_id", lessonId);
    setMessages(data.data);
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    channel.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prev) => [...prev, payload.payload.message]);
    });
  }, []);

  return (
    <div className="rounded-[5px] relative px-[16px] py-[0] pb-[16px] flex-[1] flex flex-col border border-gray-200">
      <div className="flex justify-center gap-[12px] px-[0] py-[12px]">
        <button
          className="icon-button"
          onClick={() => setIsCreatePollModalOpen(true)}
        >
          <PollIcon />
        </button>
        <button className="icon-button">
          <ClearIcon />
        </button>
        <button className="icon-button">
          <BlockChatIcon />
        </button>
      </div>
      <hr />
      <div
        ref={messagesRef}
        className={`flex-[1] flex flex-col gap-[8px] overflow-y-auto mb-[12px] max-h-[${typeof window !== "undefined" ? window.innerHeight - 200 : 0}px]`}
      >
        {messages.map((msg) =>
          msg.is_poll ? (
            <Poll
              onDone={getMessages}
              author={msg.author}
              key={msg.id}
              poll={msg.polls[0]}
            />
          ) : (
            <Message key={msg.id} message={msg} />
          )
        )}
      </div>
      <Input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        Icon={<AttachIcon />}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateMesssage();
          }
        }}
      />
      {isCreatePollModalOpen && (
        <CreatePollModal
          lessonId={lessonId}
          closeModal={() => setIsCreatePollModalOpen(false)}
          author={userName}
          onDone={getMessages}
        />
      )}
    </div>
  );
};

export default Chat;
