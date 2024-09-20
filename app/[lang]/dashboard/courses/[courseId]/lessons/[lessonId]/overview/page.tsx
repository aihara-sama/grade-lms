import LessonPreview from "@/components/lesson-preview";
import LessonProvider from "@/components/lesson-provider";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
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
  const DB = getServerDB();

  const courseData = await DB.from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!courseData.data) return redirect("/dashboard/courses");

  const lessonData = await DB.from("lessons")
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
