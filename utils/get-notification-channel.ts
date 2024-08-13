import { supabaseClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

let channel: RealtimeChannel;

export const getNotificationChannel = (name: string) => {
  if (!channel) {
    channel = supabaseClient.channel(name);
  }

  return channel;
};
export const closeNotificationChannel = () => {
  channel = undefined;
};
