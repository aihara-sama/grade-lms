"use client";

import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import type { Database } from "@/types/supabase.type";
import { db } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
  updateLessonTitle: (title: string) => void;
}

const LessonSettings: FunctionComponent<IProps> = ({
  lesson,
  updateLessonTitle,
}) => {
  const router = useRouter();
  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const handleRenameLesson = async () => {
    const { error } = await db
      .from("lessons")
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
  };

  return (
    <div>
      <p className="section-title">Settings</p>
      <div className="rename-wrapper">
        <div className="flex gap-1 items-end">
          <Input
            label="Lesson name"
            Icon={<CoursesIcon size="xs" />}
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="mb-auto"
          />
          <button
            disabled={!lessonTitle}
            className="primary-button w-24"
            onClick={handleRenameLesson}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonSettings;
