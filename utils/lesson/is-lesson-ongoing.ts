import type { Lesson } from "@/types/lesson.type";

export const isLessonOngoing = (lesson: Lesson) =>
  Date.now() > +new Date(lesson.starts) && Date.now() < +new Date(lesson.ends);
