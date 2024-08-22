"use client";

import AttachIcon from "@/components/icons/attach-icon";
import Input from "@/components/input";
import Message from "@/components/live-lesson/chat/message";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

import MessagesIcon from "@/components/icons/messages-icon";
import type { Role } from "@/interfaces/user.interface";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface IProps {
  lessonId: string;
  userName: string;
  avatar: string;
  userRole: Role;
  channel: RealtimeChannel;
}

const Chat: FunctionComponent<IProps> = ({
  lessonId,
  userName,
  channel,
  avatar,
  userRole,
}) => {
  // State
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      author: string;
      author_avatar: string;
      author_role: string;
      id: string;
      lesson_id: string;
      reply_id: string;
      text: string;
    }[]
  >([]);

  // Refs
  const messagesRef = useRef<HTMLDivElement>();

  // Handlers
  const handleCreateMesssage = async (replyId?: string) => {
    const { error, data } = await supabaseClient
      .from("messages")
      .insert({
        text: message,
        author: userName,
        lesson_id: lessonId,
        reply_id: replyId,
        author_avatar: avatar,
        author_role: userRole,
      })
      .select("*")
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
      .select("*")
      .eq("lesson_id", lessonId);
    setMessages(data.data);
  };

  // Effects
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
        ref={messagesRef}
        className="flex-1 flex flex-col overflow-y-auto mb-3 mt-3 pr-1"
      >
        <div className="flex flex-1 flex-col gap-2">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`${idx === 0 ? "mt-auto" : ""}`}>
              <Message message={msg} />
            </div>
          ))}
        </div>
      </div>
      <Input
        className="mt-auto"
        fullWIdth
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        Icon={<AttachIcon />}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateMesssage();
          }
        }}
      />
    </div>
  );
};

export default Chat;
