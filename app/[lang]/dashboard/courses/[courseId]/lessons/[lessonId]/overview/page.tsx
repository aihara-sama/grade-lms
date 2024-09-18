import LessonPreview from "@/components/lesson-preview";
import LessonProvider from "@/components/lesson-provider";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { createClient } from "@/utils/supabase/server";
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
  const courseData = await createClient()
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!courseData.data) return redirect("/dashboard/courses");

  const lessonData = await createClient()
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lessonData.data)
    return redirect(`/dashboard/courses/${courseId}/lessons`);

  return (
    <LessonProvider lesson={lessonData.data}>
      <LessonHeader course={courseData.data} lesson={lessonData.data} />
      <LessonPreview />
    </LessonProvider>
  );
};

export default Page;
export const dynamic = "force-dynamic";
