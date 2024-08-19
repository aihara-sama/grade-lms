import type { CourseWithRefsCount } from "@/types/courses.type";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";

// Get
export const getCoursesCountByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("courses(count)")
    .eq("id", userId)
    .returns<Record<"courses", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed-to-load-courses-count"));

  return result.data.courses[0].count;
};

export const getCoursesCountByTitleAndUserId = async (
  title: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("courses(count)")
    .ilike("courses.title", `%${title}%`)
    .eq("id", userId)
    .returns<Record<"courses", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed-to-load-courses-count"));

  return result;
};

export const getCoursesByTitleAndUserId = async (
  title: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .ilike("courses.title", `%${title}%`)
    .eq("id", userId)
    .limit(20, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed-to-load-courses"));

  return result;
};

export const getCoursesByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .eq("id", userId)
    .limit(20, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed-to-load-courses"));

  return result.data.courses;
};

export const getRangeCoursesByUserId = async (
  userId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("courses(*, lessons(count), users(count))")
    .eq("id", userId)
    .range(from, to, { foreignTable: "courses" })
    .order("title", { foreignTable: "courses", ascending: true })
    .returns<Record<"courses", CourseWithRefsCount[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed-to-load-courses"));

  return result;
};

export const createCourse = async (title: string) => {
  const t = await loadMessages();

  const result = await supabaseClient.from("courses").insert({
    title,
  });

  if (result.error) throw new Error(t("failed-to-create-course"));
};

// Delete
export const deleteCourseByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (result.error) throw new Error(t("failed-to-delete-course"));

  return result;
};
export const deleteCoursesByCourseIds = async (courseIds: string[]) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .delete()
    .in("id", courseIds);

  if (result.error) throw new Error(t("failed-to-delete-courses"));

  return result;
};
