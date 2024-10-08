"use client";

import { LessonContext } from "@/contexts/lesson-context";
import type { getLesson } from "@/db/server/lesson";
import { createLessonStore } from "@/stores/lesson-store";
import type { ResultOf } from "@/types/utils.type";
import type { FunctionComponent, PropsWithChildren } from "react";
import { useRef } from "react";

interface Props {
  lesson: ResultOf<typeof getLesson>;
}

const LessonProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  lesson,
  children,
}) => {
  // Hooks
  const store = useRef(createLessonStore(lesson)).current;

  // View
  return (
    <LessonContext.Provider value={store}>{children}</LessonContext.Provider>
  );
};

export default LessonProvider;
