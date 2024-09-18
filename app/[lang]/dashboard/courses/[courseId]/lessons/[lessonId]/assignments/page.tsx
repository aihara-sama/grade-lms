import Assignments from "@/components/assignments";
import LessonProvider from "@/components/lesson-provider";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { createClient } from "@/utils/supabase/server";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    lessonId: string;
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({
  params: { lessonId, courseId },
}) => {
  const lesson = await createClient()
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  const course = await createClient()
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  return (
    <LessonProvider lesson={lesson.data}>
      <LessonHeader course={course.data} lesson={lesson.data} />
      <Assignments lesson={lesson.data} />
    </LessonProvider>
  );
};

export default Page;
export const dynamic = "force-dynamic";
