import LessonProvider from "@/components/lesson-provider";
import LiveLesson from "@/components/live-lesson";
import { db } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    lessonId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { lessonId } }) => {
  const lessonResult = await db
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", lessonId)
    .single();

  if (!lessonResult.data) {
    return redirect("/dashboard");
  }

  return (
    <LessonProvider lesson={lessonResult.data}>
      <LiveLesson lesson={lessonResult.data} />
    </LessonProvider>
  );
};

export default Page;
