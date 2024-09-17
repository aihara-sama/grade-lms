"use client";

import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";

let notificationChannel: RealtimeChannel;

export const useNotificationChannel = () => {
  const { user } = useUser();
  const { lessonId } = useParams();

  notificationChannel =
    notificationChannel ||
    db.channel(user.role === Role.Teacher ? user.id : user.creator_id);

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
