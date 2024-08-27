export const isLessonEnded = (ends: Date) => +new Date() >= +new Date(ends);
