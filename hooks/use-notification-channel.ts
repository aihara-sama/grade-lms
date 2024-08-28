"use client";

import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect } from "react";

let channel: RealtimeChannel;

export const useNotificationChannel = () => {
  const { user } = useUser();

  channel =
    channel ||
    db.channel(user.role === Role.Teacher ? user.id : user.creator_id);

  useEffect(() => {
    return () => {
      channel.unsubscribe().then(() => {
        channel = undefined;
      });
    };
  }, []);

  return channel;
};
