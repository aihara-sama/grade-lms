"use client";

import { DB } from "@/lib/supabase/db/browser-db";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

let chatChannel: RealtimeChannel;

export const useChatChannel = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();

  chatChannel = chatChannel || DB.channel(`chat-${lessonId}`);

  return chatChannel;
};
