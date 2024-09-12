"use client";

import { useLesson } from "@/hooks/use-lesson";
import type { Lesson } from "@/types/lessons.type";
import { isLessonEnded } from "@/utils/is-lesson-ended";
import { isLessonOngoing } from "@/utils/is-lesson-ongoing";
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
    lessonStore.setisEnded(isLessonEnded(new Date(lesson.ends)));
    lessonStore.setisOngoing(isLessonOngoing(lesson));
  }, []);

  // View
  if (lessonStore.lesson === null) return null;
  if (lessonStore.lesson === undefined) return null;

  // View
  return <>{children}</>;
};

export default LessonProvider;
