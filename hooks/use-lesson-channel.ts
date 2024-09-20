"use client";

import { useUser } from "@/hooks/use-user";
import { browserDB } from "@/lib/supabase/db/browser-db";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

let lessonChannel: RealtimeChannel;

export const useLessonChannel = () => {
  const params = useParams<{ lessonId?: string }>();
  const { user } = useUser();

  lessonChannel =
    lessonChannel ||
    browserDB.channel(params.lessonId || uuid(), {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

  useEffect(() => {
    return () => {
      if (lessonChannel)
        lessonChannel.unsubscribe().then(() => {
          lessonChannel = undefined;
        });
    };
  }, []);
  return lessonChannel;
};
