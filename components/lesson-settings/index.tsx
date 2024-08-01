"use client";

import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";
import CourseIcon from "../icons/course-icon";
import Input from "../input";

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
    const { error } = await supabaseClient
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
        <p>Lesson name</p>
        <div className="flex items-stretch gap-[4px]">
          <Input
            Icon={<CourseIcon size="xs" />}
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
          />
          <button
            disabled={!lessonTitle}
            className="primary-button w-[100px]"
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
