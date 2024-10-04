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

export const getCourses = async (options?: { head?: boolean }) => {
  const { data, count } = await getServerDB()
    .from("courses")
    .select("*, lessons(count), users(count)", { count: "exact", ...options })
    .order("created_at", { ascending: true })
    .range(0, COURSES_GET_LIMIT - 1)
    .returns<CourseWithRefsCount[]>();

  return { data, count };
};

export const getLatestCourses = async () => {
  const { data, count } = await getServerDB()
    .from("courses")
    .select("*, users(count), lessons(count)", { count: "exact" })
    .range(0, COURSES_GET_LIMIT - 1)
    .order("created_at", { ascending: false })
    .returns<CourseWithRefsCount[]>();

  return { data, count };
};
