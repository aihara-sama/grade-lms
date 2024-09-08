import { COURSES_GET_LIMIT } from "@/constants";
import type { CourseWithRefsCount } from "@/types/courses.type";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

// Get
export const getCourses = async (
  userId: string,
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .eq("id", userId)
    .ilike("courses.title", `%${title}%`)
    .range(from, to, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data.courses;
};
export const getCoursesCount = async (userId: string, title = "") => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(count)")
    .eq("id", userId)
    .ilike("courses.title", `%${title}%`)
    .returns<Record<"courses", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses_count"));

  return result.data.courses[0].count;
};

export const getUnenrolledCourses = async (
  userId: string,
  title = "",
  from = 0,
  to = COURSES_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await db
    .rpc("get_courses_not_assigned_to_user", {
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
  const result = await db
    .rpc("get_courses_not_assigned_to_user", {
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
  const result = await db.from("courses").insert(course);

  if (result.error) throw new Error(t("failed_to_create_course"));
};

// Delete
export const deleteCourseById = async (id: string) => {
  const t = await loadMessages();
  const result = await db.from("courses").delete().eq("id", id);

  if (result.error) throw new Error(t("failed_to_delete_course"));

  return result;
};
export const deleteCoursesByIds = async (ids: string[]) => {
  const t = await loadMessages();
  const result = await db.from("courses").delete().in("id", ids);

  if (result.error) throw new Error(t("failed_to_delete_courses"));

  return result;
};
export const deleteAllCourses = async (title = "") => {
  const t = await loadMessages();
  const result = await db.rpc("delete_all_courses", {
    p_title: title,
  });

  if (result.error) throw new Error(t("failed_to_delete_courses"));

  return result;
};
