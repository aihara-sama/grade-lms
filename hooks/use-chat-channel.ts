"use client";

import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";

let chatChannel: RealtimeChannel;

export const useChatChannel = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();

  chatChannel = chatChannel || db.channel(`chat-${lessonId}`);

  useEffect(() => {
    return () => {
      if (chatChannel)
        chatChannel.unsubscribe().then(() => {
          chatChannel = undefined;
        });
    };
  }, [lessonId]);

  return chatChannel;
};
