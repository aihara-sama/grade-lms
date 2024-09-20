import type { Lesson } from "@/types/lesson.type";

export const isLessonEnded = (lesson: Lesson) =>
  +new Date() >= +new Date(lesson.ends);
