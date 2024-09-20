"use client";

import LessonSettings from "@/components/lesson-settings";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";

import LessonProvider from "@/components/lesson-provider";
import { useUser } from "@/hooks/use-user";
import { browserDB } from "@/lib/supabase/db/browser-db";
import type { Database } from "@/types/supabase.type";

interface Props {
  params: {
    courseId: string;
    lessonId: string;
  };
}
const Page: FunctionComponent<Props> = ({ params }) => {
  const router = useRouter();
  const { user } = useUser();

  const [course, setCourse] =
    useState<Database["public"]["Tables"]["courses"]["Row"]>();
  const [lesson, setLesson] =
    useState<Database["public"]["Tables"]["lessons"]["Row"]>();

  useEffect(() => {
    (async () => {
      const { data: courseData, error: courseError } = await browserDB
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();
      const { data: lessonData, error: lessonError } = await browserDB
        .from("lessons")
        .select("*")
        .eq("id", params.lessonId)
        .single();

      if (courseError || lessonError) {
        router.push(`/${user.preferred_locale}/dashboard/courses`);
      } else {
        setCourse(courseData);
        setLesson(lessonData);
      }
    })();
  }, []);

  return (
    <div>
      {course && lesson && (
        <LessonProvider lesson={lesson}>
          <LessonHeader course={course} lesson={lesson} />
          <LessonSettings
            updateLessonTitle={(title) =>
              setLesson((prev) => ({ ...prev, title }))
            }
            lesson={lesson}
          />
        </LessonProvider>
      )}
    </div>
  );
};

export default Page;
