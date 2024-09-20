import type { TablesInsert } from "@/types/supabase.type";

export const parseUsersCoursesIds = (
  usersIds: string[],
  coursesIds: string[]
) => {
  const userCourses: TablesInsert<"user_courses">[] = [];

  for (let idx = 0; idx < usersIds.length; idx++) {
    const userId = usersIds[idx];

    for (let i = 0; i < coursesIds.length; i++) {
      const courseId = coursesIds[i];

      userCourses.push({
        course_id: courseId,
        user_id: userId,
      });
    }
  }

  return userCourses;
};
