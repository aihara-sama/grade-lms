import type { Lesson } from "@/types/lessons.type";

export const getLessonDuration = (lesson: Lesson) =>
  +new Date(lesson.ends) - +new Date(lesson.starts);
