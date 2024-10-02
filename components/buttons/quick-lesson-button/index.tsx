"use client";

import { DB } from "@/lib/supabase/db";
import { addMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

const QuickLessonButton: FunctionComponent = () => {
  // Hooks
  const router = useRouter();
  const t = useTranslations();

  // Handlers
  const submitCreateLesson = async () => {
    try {
      const { error, data } = await DB.from("lessons")
        .insert({
          starts: new Date().toISOString(),
          ends: addMinutes(new Date(), 30).toISOString(),
        })
        .select("id")
        .single();

      if (error) throw new Error(t("error.failed_to_create_lesson"));
      router.push(`/dashboard/lessons/${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <button className="primary-button" onClick={submitCreateLesson}>
      Quick lesson
    </button>
  );
};

export default QuickLessonButton;
