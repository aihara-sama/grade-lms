"use client";

import LessonSettings from "@/components/lesson-settings";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";

import type { Database } from "@/types/supabase.type";

interface IProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}
const Page: FunctionComponent<IProps> = ({ params }) => {
  const router = useRouter();

  const [course, setCourse] =
    useState<Database["public"]["Tables"]["courses"]["Row"]>();
  const [lesson, setLesson] =
    useState<Database["public"]["Tables"]["lessons"]["Row"]>();

  useEffect(() => {
    (async () => {
      const { data: courseData, error: courseError } = await supabaseClient
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();
      const { data: lessonData, error: lessonError } = await supabaseClient
        .from("lessons")
        .select("*")
        .eq("id", params.lessonId)
        .single();

      if (courseError || lessonError) {
        router.push("/dashboard/courses");
      } else {
        setCourse(courseData);
        setLesson(lessonData);
      }
    })();
  }, []);

  return (
    <div>
      {course && lesson && (
        <>
          <LessonHeader course={course} lesson={lesson} />
          <LessonSettings
            updateLessonTitle={(title) =>
              setLesson((prev) => ({ ...prev, title }))
            }
            lesson={lesson}
          />
        </>
      )}
    </div>
  );
};

export default Page;
