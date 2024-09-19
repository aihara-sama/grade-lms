"use client";

import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

let chatChannel: RealtimeChannel;

export const useChatChannel = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();

  chatChannel = chatChannel || db.channel(`chat-${lessonId}`);

  return chatChannel;
};
