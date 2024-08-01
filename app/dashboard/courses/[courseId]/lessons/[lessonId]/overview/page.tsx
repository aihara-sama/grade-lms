import LessonPreview from "@/components/lesson-preview";
import LessonHeader from "@/components/lesson/lesson-header";
import { supabaseClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { type FunctionComponent } from "react";

interface IProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

const Page: FunctionComponent<IProps> = async ({
  params: { lessonId, courseId },
}) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

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
    <div className="page-wrapper">
      <LessonHeader course={course.data} lesson={lesson.data} />
      <LessonPreview lesson={lesson.data} user={user} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
