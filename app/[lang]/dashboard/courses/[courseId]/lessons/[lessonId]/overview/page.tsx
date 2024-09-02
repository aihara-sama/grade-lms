import LessonPreview from "@/components/lesson-preview";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { db } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
    lessonId: string;
  };
}

const Page: FunctionComponent<Props> = async ({
  params: { lessonId, courseId },
}) => {
  const courseData = await db
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!courseData.data) return redirect("/dashboard/courses");

  const lessonData = await db
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lessonData.data)
    return redirect(`/dashboard/courses/${courseId}/lessons`);

  return (
    <div>
      <LessonHeader course={courseData.data} lesson={lessonData.data} />
      <LessonPreview lesson={lessonData.data} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
