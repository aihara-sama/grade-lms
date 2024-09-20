"use client";

import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { DB } from "@/lib/supabase/db/browser-db";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";

let notificationChannel: RealtimeChannel;

export const useNotificationChannel = () => {
  const { user } = useUser();
  const { lessonId } = useParams();

  notificationChannel =
    notificationChannel ||
    DB.channel(user.role === Role.Teacher ? user.id : user.creator_id);

  useEffect(() => {
    return () => {
      if (notificationChannel)
        notificationChannel.unsubscribe().then(() => {
          notificationChannel = undefined;
        });
    };
  }, [lessonId]);

  return notificationChannel;
};
