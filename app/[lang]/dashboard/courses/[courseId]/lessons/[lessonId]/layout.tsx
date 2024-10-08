import LessonProvider from "@/components/providers/lesson-provider";
import { getLesson } from "@/db/server/lesson";
import { redirect } from "next/navigation";
import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  params: {
    lessonId: string;
  };
}

const Layout: FunctionComponent<PropsWithChildren<Props>> = async ({
  params: { lessonId },
  children,
}) => {
  const lesson = await getLesson(lessonId);

  if (!lesson) return redirect("/dashboard");

  return <LessonProvider lesson={lesson}>{children}</LessonProvider>;
};

export default Layout;
