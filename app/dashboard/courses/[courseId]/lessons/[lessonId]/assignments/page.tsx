import Assignments from "@/components/assignments";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { supabaseClient } from "@/utils/supabase/client";

import { type FunctionComponent } from "react";

interface IProps {
  params: {
    lessonId: string;
    courseId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({
  params: { lessonId, courseId },
}) => {
  const lesson = await supabaseClient
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  const course = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  return (
    <div>
      <LessonHeader course={course.data} lesson={lesson.data} />
      <Assignments lessonId={lessonId} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";