import LiveLesson from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson";
import ChatProvider from "@/components/providers/chat-provider";
import LessonProvider from "@/components/providers/lesson-provider";
import { getLessonWithCourse } from "@/db/server/lesson";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

export const generateMetadata = async ({
  params: { lessonId },
}: {
  params: { lessonId: string };
}): Promise<Metadata> => {
  const lesson = await getLessonWithCourse(lessonId);

  return {
    title: lesson?.title,
  };
};
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
