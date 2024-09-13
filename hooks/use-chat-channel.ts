"use client";

import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";

let chatChannel: RealtimeChannel;

export const useChatChannel = () => {
  const params = useParams<{ lessonId?: string }>();

  chatChannel = chatChannel || db.channel(`chat-${params.lessonId}`);

  useEffect(() => {
    return () => {
      chatChannel = undefined;
    };
  }, []);

  return chatChannel;
};
