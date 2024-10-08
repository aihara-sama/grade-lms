import LiveLesson from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson";
import ChatProvider from "@/components/providers/chat-provider";
import LessonProvider from "@/components/providers/lesson-provider";
import { getLessonWithCourse } from "@/db/server/lesson";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    lessonId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { lessonId } }) => {
  const lesson = await getLessonWithCourse(lessonId);

  if (!lesson) return redirect("/dashboard");

  return (
    <LessonProvider lesson={lesson}>
      <ChatProvider>
        <LiveLesson />
      </ChatProvider>
    </LessonProvider>
  );
};

export default Page;
