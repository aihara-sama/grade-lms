import { LESSONS_GET_LIMIT } from "@/constants";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";

export const deleteLessonsByLessonsIds = async (lessonsIds: string[]) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("lessons")
    .delete()
    .in("id", lessonsIds);

  if (result.error)
    throw new Error(
      t(
        lessonsIds.length === 1
          ? "failed_to_delete_lesson"
          : "failed_to_delete_lessons"
      )
    );

  return result;
};
export const createLesson = async (lesson: TablesInsert<"lessons">) => {
  const t = await loadMessages();
  const result = await supabaseClient.from("lessons").insert(lesson);

  if (result.error) throw new Error(t("failed_to_create_lesson"));
};

export const getLessonsCountByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("lessons(count)")
    .eq("id", courseId)
    .returns<Record<"lessons", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons_count"));

  return result.data.lessons[0].count;
};

export const getLessonsCountByTitleAndCourseId = async (
  title: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("lessons(count)")
    .ilike("lessons.title", `%${title}%`)
    .eq("id", courseId)
    .returns<Record<"lessons", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons_count"));

  return result.data.lessons[0].count;
};

export const getLessonsByTitleAndCourseId = async (
  title: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("lessons(*)")
    .ilike("lessons.title", `%${title}%`)
    .eq("id", courseId)
    .limit(LESSONS_GET_LIMIT, { foreignTable: "lessons" })
    .order("title", { foreignTable: "lessons", ascending: true })
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data.lessons;
};

export const getLessonsByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("lessons(*)")
    .eq("id", courseId)
    .limit(LESSONS_GET_LIMIT, { foreignTable: "lessons" })
    .order("title", { foreignTable: "lessons", ascending: true })
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data.lessons;
};

export const getOffsetLessonsByTitleAndCourseId = async (
  courseId: string,
  title: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("lessons(*)")
    .eq("id", courseId)
    .ilike("lessons.title", `%${title}%`)
    .range(from, to, { foreignTable: "lessons" })
    .order("title", { foreignTable: "lessons", ascending: true })
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data.lessons;
};

export const deleteLessonsByTitleAndCourseId = async (
  title: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("lessons")
    .delete()
    .eq("course_id", courseId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_lessons"));

  return result;
};
