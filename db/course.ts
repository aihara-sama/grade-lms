import { COURSES_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// Get
export const getCourses = async (
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("*, lessons(count), users(count)")
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data;
};
export const getCoursesCount = async (title = "") => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("count")
    .ilike("title", `%${title}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_courses_count"));

  return result.data[0].count;
};
export const getUnenrolledCourses = async (
  userId: string,
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const result = await DB.rpc("get_unenrolled_courses", {
    p_user_id: userId,
    p_course_title: title,
  })
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data;
};
export const getUnenrolledCoursesCount = async (userId: string, title = "") => {
  const t = await loadMessages();
  const result = await DB.rpc("get_unenrolled_courses", {
    p_user_id: userId,
    p_course_title: title,
  })
    .select("count")
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_courses_count"));

  return result.data[0].count;
};

// Create
export const createCourse = async (course: TablesInsert<"courses">) => {
  const t = await loadMessages();

  const result = await DB.from("courses").insert(course);

  if (result.error) throw new Error(t("failed_to_create_course"));
};

// Delete
export const deleteCourseById = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("courses").delete().eq("id", id);

  if (result.error) throw new Error(t("failed_to_delete_course"));
};
export const deleteCoursesByIds = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.from("courses").delete().in("id", ids);

  if (result.error) throw new Error(t("failed_to_delete_courses"));
};
export const deleteAllCourses = async (title = "") => {
  const t = await loadMessages();

  const result = await DB.from("courses").delete().ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_courses"));
};
