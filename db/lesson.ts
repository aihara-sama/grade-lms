import { LESSONS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { Lesson } from "@/types/lesson.type";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";
import { format } from "date-fns";

export const getWeekLessons = async (days: string[], courseId?: string) => {
  const t = await loadMessages();
  const builder = DB.from("lessons")
    .select("*")
    .filter("course_id", "not.is", null)
    .gte("starts", format(days[0], "yyyy-MM-dd'T'HH:mm:ss"))
    .lte(
      "starts",
      format(`${days[days.length - 1]} 23:45:00`, "yyyy-MM-dd'T'HH:mm:ss")
    )
    .order("starts", { ascending: true });

  const result = await (courseId ? builder.eq("course_id", courseId) : builder);

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data;
};

export const getLessonsCountByCourseId = async (
  courseId: string,
  title = ""
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("lessons(count)")
    .ilike("lessons.title", `%${title}%`)
    .eq("id", courseId)
    .returns<Record<"lessons", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons_count"));

  return result.data.lessons[0].count;
};

export const getLessonsByCourseId = async (
  courseId: string,
  title = "",
  from = 0,
  to = LESSONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("lessons(*)")
    .eq("id", courseId)
    .ilike("lessons.title", `%${title}%`)
    .range(from, to, { foreignTable: "lessons" })
    .order("title", { foreignTable: "lessons", ascending: true })
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons"));

  return result.data.lessons;
};

export const getOverlappingLessons = async (
  starts: string,
  ends: string,
  userId: string,
  lessonId?: string
) => {
  const t = await loadMessages();

  const result = await DB.rpc("get_overlapping_lesson", {
    p_user_id: userId,
    p_lesson_id: lessonId,
    p_ends: ends,
    p_starts: starts,
  });
  if (result.error) throw new Error(t("something_went_wrong"));

  return result.data;
};

export const deleteLessonById = async (id: string) => {
  const t = await loadMessages();
  const result = await DB.from("lessons").delete().eq("id", id);

  if (result.error) throw new Error(t("failed_to_delete_lessons"));

  return result;
};
export const deleteLessonsByds = async (ids: string[]) => {
  const t = await loadMessages();
  const result = await DB.rpc("delete_lessons_by_ids", {
    p_lessons_ids: ids,
  });

  if (result.error) throw new Error(t("failed_to_delete_lessons"));

  return result;
};

export const createLesson = async (lesson: TablesInsert<"lessons">) => {
  const t = await loadMessages();

  const result = await DB.from("lessons").insert(lesson);

  if (result.error) throw new Error(t("failed_to_create_lesson"));
};

export const upsertLesson = async (lesson: Lesson) => {
  const t = await loadMessages();
  const result = await DB.from("lessons").upsert(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_save_lesson"));
};

export const deleteAllLessons = async (courseId: string, title = "") => {
  const t = await loadMessages();
  const result = await DB.from("lessons")
    .delete()
    .eq("course_id", courseId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_lessons"));

  return result;
};

export const extendLesson = async (lesson: Lesson, miliseconds: number) => {
  const t = await loadMessages();

  const result = await DB.from("lessons")
    .update({
      ends: new Date(+new Date(lesson.ends) + miliseconds).toISOString(),
    })
    .eq("id", lesson.id)
    .select("*")
    .single();

  if (result.error) throw new Error(t("failed_to_extend_lesson"));

  return result.data;
};
export const updateLesson = async (lesson: TablesUpdate<"lessons">) => {
  const t = await loadMessages();
  const result = await DB.from("lessons").update(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_update_lesson"));

  return result.data;
};

export const getLessonById = async (id: string) => {
  const t = await loadMessages();
  const result = await DB.from("lessons").select("*").eq("id", id).single();

  if (result.error) throw new Error(t("failed_to_load_lesson"));

  return result.data;
};
