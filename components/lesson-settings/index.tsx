"use client";

import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import LoadingSpinner from "@/components/loading-spinner";
import { DB } from "@/lib/supabase/db";
import type { Database } from "@/types/supabase.type";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
  updateLessonTitle: (title: string) => void;
}

const LessonSettings: FunctionComponent<Props> = ({
  lesson,
  updateLessonTitle,
}) => {
  const router = useRouter();
  const [lessonTitle, setLessonTitle] = useState(lesson.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRenameLesson = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await DB.from("lessons")
        .update({
          title: lessonTitle,
        })
        .eq("id", lesson.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Saved!");
        updateLessonTitle(lessonTitle);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="section-title">Settings</p>
      <div className="rename-wrapper">
        <div className="flex gap-1 items-end">
          <Input
            label="Lesson name"
            StartIcon={<CoursesIcon size="xs" />}
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!lessonTitle || isSubmitting}
            className="primary-button w-24"
            onClick={handleRenameLesson}
          >
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonSettings;
