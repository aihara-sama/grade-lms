import { COURSES_GET_LIMIT } from "@/constants";
import type { CourseWithRefsCount } from "@/types/courses.type";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

// Get
export const getCoursesCountByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(count)")
    .eq("id", userId)
    .returns<Record<"courses", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses_count"));

  return result.data.courses[0].count;
};

export const getCoursesCountByTitleAndUserId = async (
  title: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(count)")
    .ilike("courses.title", `%${title}%`)
    .eq("id", userId)
    .returns<Record<"courses", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses_count"));

  return result.data.courses[0].count;
};

export const getCoursesByTitleAndUserId = async (
  title: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .ilike("courses.title", `%${title}%`)
    .eq("id", userId)
    .limit(COURSES_GET_LIMIT, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data.courses;
};

export const getCoursesWithRefsCountByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .eq("id", userId)
    .limit(COURSES_GET_LIMIT, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data.courses;
};
export const getCoursesByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("id, courses(*)")
    .eq("id", userId)
    .limit(COURSES_GET_LIMIT)
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data.courses;
};
export const getCourseByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
    .select("*, users (*), lessons (*)")
    .eq("id", courseId)
    .single();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data;
};
export const getUnenrolledCoursesByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await db
    .rpc("get_courses_not_assigned_to_user", {
      p_user_id: userId,
    })
    .returns<CourseWithRefsCount[]>();

  if (result.error) throw new Error(t("failed_to_load_courses"));

  return result.data;
};

export const getOffsetCoursesByTitleAndUserId = async (
  userId: string,
  title: string,
  from: number,
  to: number
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

export const createCourse = async (course: TablesInsert<"courses">) => {
  const t = await loadMessages();
  const result = await db.from("courses").insert(course);

  if (result.error) throw new Error(t("failed_to_create_course"));
};

// Delete
export const deleteCourseByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await db.from("courses").delete().eq("id", courseId);

  if (result.error) throw new Error(t("failed_to_delete_course"));

  return result;
};
export const deleteCoursesByCoursesIds = async (coursesIds: string[]) => {
  const t = await loadMessages();
  const result = await db.from("courses").delete().in("id", coursesIds);

  if (result.error) throw new Error(t("failed_to_delete_courses"));

  return result;
};

export const deleteCoursesByTitleAndUserId = async (
  title: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await db.rpc("delete_courses_by_title_and_user_id", {
    p_user_id: userId,
    p_title: title,
  });

  if (result.error) throw new Error(t("failed_to_delete_courses"));

  return result;
};
