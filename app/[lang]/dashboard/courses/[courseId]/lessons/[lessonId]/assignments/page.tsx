import Assignments from "@/components/assignments";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { db } from "@/utils/supabase/client";

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
  const lesson = await db
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  const course = await db
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  return (
    <>
      <LessonHeader course={course.data} lesson={lesson.data} />
      <Assignments lesson={lesson.data} />
    </>
  );
};

export default Page;
export const dynamic = "force-dynamic";
