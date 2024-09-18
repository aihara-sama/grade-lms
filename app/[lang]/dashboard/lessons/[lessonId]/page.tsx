import ChatProvider from "@/components/chat-provider";
import LessonProvider from "@/components/lesson-provider";
import LiveLesson from "@/components/live-lesson";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    lessonId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { lessonId } }) => {
  const lessonResult = await createClient()
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", lessonId)
    .single();

  if (!lessonResult.data) {
    return redirect("/dashboard");
  }

  return (
    <LessonProvider lesson={lessonResult.data}>
      <ChatProvider>
        <LiveLesson lesson={lessonResult.data} />
      </ChatProvider>
    </LessonProvider>
  );
};

export default Page;
