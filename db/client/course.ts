import { COURSES_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getCourses = async (
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("courses")
    .select("*, lessons(count), users(count)", { count: "exact" })
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (error) throw new Error(t("error.failed_to_load_courses"));

  return { data, count };
};
export const getCoursesCount = async (title = "") => {
  const t = await loadMessages();

  const result = await DB.from("courses")
    .select("count")
    .ilike("title", `%${title}%`)
    .returns<{ count: number }[]>()
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_courses_count"));

  return result.data.count;
};
export const getLatestCourses = async (
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("courses")
    .select("*, users(count), lessons(count)", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false })
    .returns<CourseWithRefsCount[]>();

  if (error) throw new Error(t("error.failed_to_load_courses"));

  return { data, count };
};
export const getUnenrolledCourses = async (
  userId: string,
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.rpc(
    "get_unenrolled_courses",
    {
      p_user_id: userId,
      p_course_title: title,
    },
    { count: "exact" }
  )
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (error) throw new Error(t("error.failed_to_load_courses"));

  return { data, count };
};
export const getUnenrolledCoursesCount = async (userId: string, title = "") => {
  const t = await loadMessages();

  const result = await DB.rpc("get_unenrolled_courses", {
    p_user_id: userId,
    p_course_title: title,
  })
    .select("count")
    .returns<{ count: number }[]>()
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_courses_count"));

  return result.data.count;
};

// CREATE
export const createCourse = async (course: TablesInsert<"courses">) => {
  const t = await loadMessages();

  const result = await DB.from("courses")
    .insert(course)
    .select("*, lessons(count), users(count)")
    .single();

  if (result.error) throw new Error(t("error.failed_to_create_course"));

  return result.data;
};

// UPDATE
export const updateCourse = async (course: TablesUpdate<"courses">) => {
  const t = await loadMessages();

  const result = await DB.from("courses").update(course).eq("id", course.id);

  if (result.error) throw new Error(t("error.failed_to_update_course"));

  return result.data;
};

// DELTE
export const deleteCourse = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("courses").delete().eq("id", id);

  if (result.error) throw new Error(t("error.failed_to_delete_course"));
};
export const deleteCourses = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_courses_by_ids", { p_courses_ids: ids });

  if (result.error) throw new Error(t("error.failed_to_delete_courses"));
};
export const deleteAllCourses = async (title = "") => {
  const t = await loadMessages();

  const result = await DB.from("courses").delete().ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("error.failed_to_delete_courses"));
};