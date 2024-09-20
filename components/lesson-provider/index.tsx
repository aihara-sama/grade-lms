"use client";

import { useLesson } from "@/hooks/use-lesson";
import type { Lesson } from "@/types/lesson.type";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useEffect } from "react";

interface Props {
  lesson: Lesson;
}

const LessonProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  lesson,
  children,
}) => {
  // Hooks
  const lessonStore = useLesson();

  // Effects
  useEffect(() => {
    lessonStore.setLesson(lesson);

    return () => {
      lessonStore.setLesson(null);
    };
  }, []);

  // View
  if (lessonStore.lesson === null) return null;
  if (lessonStore.lesson === undefined) return null;

  // View
  return <>{children}</>;
};

export default LessonProvider;
