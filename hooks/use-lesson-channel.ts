"use client";

import { useUser } from "@/hooks/use-user";
import { db } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

let channel: RealtimeChannel;

export const useLessonChannel = () => {
  const params = useParams<{ lessonId?: string }>();
  const { user } = useUser();

  channel =
    channel ||
    db.channel(params.lessonId || uuid(), {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

  useEffect(() => {
    return () => {
      if (channel)
        channel.unsubscribe().then(() => {
          channel = undefined;
        });
    };
  }, []);
  return channel;
};
