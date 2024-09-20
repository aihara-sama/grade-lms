import type { Lesson } from "@/types/lessons.type";

export const isLessonEnded = (lesson: Lesson) =>
  +new Date() >= +new Date(lesson.ends);
