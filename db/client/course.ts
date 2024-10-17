import { COURSES_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";
import { addDays, format, subWeeks } from "date-fns";

// GET
export const getCourses = async (
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("courses")
    .select("*, users(count), lessons(count)", { count: "exact" })
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (error) throw new Error(t("error.failed_to_load_courses"));

  return { data, count };
};

export const getCoursesCount = async () => {
  const { count } = await DB.from("courses").select("*", {
    count: "exact",
    head: true,
  });

  return { count };
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
export const getCoursesInsights = async () => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("courses")
    .select("timestamp:created_at")
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  if (error) throw new Error(t("error.failed_to_load_courses_insights"));

  return { data, count };
};
export const getUnenrolledCourses = async (
  userId: string,
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("courses")
    .select("*, user_courses(*)", { count: "exact" })
    .eq("user_courses.user_id", userId)
    .ilike("title", `%${title}%`)
    .filter("user_courses", "is", null)
    .range(from, to)
    .order("created_at", { ascending: true })
    .returns<CourseWithRefsCount[]>();

  if (error) throw new Error(t("error.failed_to_load_courses"));

  return { data, count };
};

// CREATE
export const createCourse = async (course: TablesInsert<"courses">) => {
  const t = await loadMessages();

  const result = await DB.from("courses")
    .insert(course)
    .select("*, lessons(count), users(count)")
    .returns<CourseWithRefsCount[]>()
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

// DELETE
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
