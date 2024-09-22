import { COURSES_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { CourseWithRefsCount } from "@/types/course.type";

export const getLatestCourses = async () => {
  const result = await getServerDB()
    .from("courses")
    .select("*, users(count), lessons(count)")
    .limit(COURSES_GET_LIMIT)
    .order("created_at", { ascending: false })
    .returns<CourseWithRefsCount[]>();

  if (result.error) return [];

  return result.data;
};
export const getCoursesCount = async () => {
  const result = await getServerDB()
    .from("courses")
    .select("count")
    .returns<{ count: number }[]>()
    .single();

  if (result.error) return 0;

  return result.data.count;
};
