import LessonPreview from "@/components/lesson-preview";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { supabaseClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  const courseData = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!courseData.data) return redirect("/dashboard/courses");

  const lessonData = await supabaseClient
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lessonData.data)
    return redirect(`/dashboard/courses/${courseId}/lessons`);

  return (
    <div>
      <LessonHeader course={courseData.data} lesson={lessonData.data} />
      <LessonPreview lesson={lessonData.data} user={user} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
