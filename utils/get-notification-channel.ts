import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

let channel: RealtimeChannel;

export const getNotificationChannel = (name: string) => {
  if (!channel) {
    channel = db.channel(name);
  }

  return channel;
};
export const closeNotificationChannel = () => {
  channel = undefined;
};
