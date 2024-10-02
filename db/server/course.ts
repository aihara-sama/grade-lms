import { COURSES_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { CourseWithRefsCount } from "@/types/course.type";

export const getCourse = async (id: string) => {
  const result = await getServerDB()
    .from("courses")
    .select("*, users(*), lessons(*)")
    .eq("id", id)
    .single();

  return result.data;
};

export const getCourses = async () => {
  const { data, count } = await getServerDB()
    .from("courses")
    .select("*, lessons(count), users(count)", { count: "exact" })
    .order("created_at", { ascending: true })
    .range(0, COURSES_GET_LIMIT - 1)
    .returns<CourseWithRefsCount[]>();

  return { data, count };
};

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
