import type { Lesson } from "@/types/lesson.type";

export const getLessonDuration = (lesson: Lesson) =>
  +new Date(lesson.ends) - +new Date(lesson.starts);
