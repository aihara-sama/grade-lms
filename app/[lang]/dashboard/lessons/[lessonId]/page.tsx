import ChatProvider from "@/components/chat-provider";
import LessonProvider from "@/components/lesson-provider";
import LiveLesson from "@/components/live-lesson";
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
