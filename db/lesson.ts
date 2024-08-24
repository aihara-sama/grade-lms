import { LESSONS_GET_LIMIT } from "@/constants";
import type { Lesson } from "@/types/lessons.type";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";

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
export const getWeekLessons = async (days: string[]) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("lessons")
    .select("*")
    .gte("starts", format(days[0], "yyyy-MM-dd'T'HH:mm:ss"))
    .lte(
      "starts",
      format(`${days[days.length - 1]} 23:45:00`, "yyyy-MM-dd'T'HH:mm:ss")
    )
    .order("starts", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data;
};
export const getWeekLessonsByCourseId = async (
  days: string[],
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("lessons")
    .select("*")
    .gte("starts", format(days[0], "yyyy-MM-dd'T'HH:mm:ss"))
    .lte(
      "starts",
      format(`${days[days.length - 1]} 23:45:00`, "yyyy-MM-dd'T'HH:mm:ss")
    )
    .eq("course_id", courseId);

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data;
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

export const upsertLesson = async (lesson: Lesson) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("lessons")
    .upsert(lesson)
    .eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_save_lesson"));
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
