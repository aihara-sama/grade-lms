"use client";

import { useUser } from "@/hooks/use-user";
import { supabaseClient } from "@/utils/supabase/client";
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
    supabaseClient.channel(params.lessonId || uuid(), {
      config: {
        presence: {
          key: user.id,
        },
        broadcast: {
          self: true,
        },
      },
    });

  useEffect(() => {
    return () => {
      channel.unsubscribe().then(() => {
        channel = undefined;
      });
    };
  }, []);
  return channel;
};
