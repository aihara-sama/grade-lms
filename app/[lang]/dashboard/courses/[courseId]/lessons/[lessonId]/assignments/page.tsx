import Assignments from "@/components/assignments";
import LessonProvider from "@/components/lesson-provider";
import LessonHeader from "@/components/live-lesson/lesson-header";
import { getLesson } from "@/db/lesson";
import { getCourse } from "@/db/server/course";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

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
  const [
    {
      data: { user },
    },
    course,
    lesson,
  ] = await Promise.all([
    getServerDB().auth.getUser(),
    getCourse(courseId),
    getLesson(lessonId),
  ]);

  if (!course || !lesson) return redirect("/dashboard");

  return (
    <LessonProvider lesson={lesson}>
      <LessonHeader course={course} lesson={lesson} />
      <Assignments user={user} lesson={lesson} />
    </LessonProvider>
  );
};

export default Page;
export const dynamic = "force-dynamic";
