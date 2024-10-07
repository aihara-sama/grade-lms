import type { Lesson } from "@/types/lesson.type";

export const isLessonEnding = (lesson: Lesson) => {
  const timeRemains = +new Date(lesson.ends) - +new Date();

  return timeRemains <= 1000 * 60;
};
