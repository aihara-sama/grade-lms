import { LESSONS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { Lesson } from "@/types/lesson.type";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";
import { format } from "date-fns";

// GET
export const getLesson = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("lessons").select("*").eq("id", id).single();

  if (result.error) throw new Error(t("error.failed_to_load_lesson"));

  return result.data;
};

export const getWeekLessons = async (days: string[], courseId?: string) => {
  const t = await loadMessages();

  const builder = DB.from("lessons")
    .select("*", { count: "exact" })
    .filter("course_id", "not.is", null)
    .gte("starts", format(days[0], "yyyy-MM-dd'T'HH:mm:ss"))
    .lte(
      "starts",
      format(`${days[days.length - 1]} 23:45:00`, "yyyy-MM-dd'T'HH:mm:ss")
    )
    .order("starts", { ascending: true });

  const { data, count, error } = await (courseId
    ? builder.eq("course_id", courseId)
    : builder);

  if (error) throw new Error(t("error.failed_to_load_lessons"));

  return { data, count };
};
export const getCourseLessons = async (
  courseId: string,
  title = "",
  from = 0,
  to = LESSONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("lessons")
    .select("*", { count: "exact" })
    .eq("course_id", courseId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_lessons"));

  return { data, count };
};
export const getCourseLessonsCount = async (courseId: string, title = "") => {
  const t = await loadMessages();

  const result = await DB.from("lessons")
    .select("count")
    .ilike("title", `%${title}%`)
    .eq("course_id", courseId)
    .returns<{ count: number }[]>()
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_lessons_count"));

  return result.data.count;
};

export const getOverlappingLessons = async (
  starts: string,
  ends: string,
  lessonId?: string
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.rpc(
    "get_overlapping_lesson",
    {
      p_lesson_id: lessonId,
      p_ends: ends,
      p_starts: starts,
    },
    { count: "exact" }
  );
  if (error) throw new Error(t("error.something_went_wrong"));

  return { data, count };
};

// CREATE
export const createLesson = async (lesson: TablesInsert<"lessons">) => {
  const t = await loadMessages();

  const { data, error } = await DB.from("lessons").insert(lesson);

  if (error) throw new Error(t("error.failed_to_create_lesson"));

  return { data };
};

// UPDATE
export const extendLesson = async (lesson: Lesson, miliseconds: number) => {
  const t = await loadMessages();

  const result = await DB.from("lessons")
    .update({
      ends: new Date(+new Date(lesson.ends) + miliseconds).toISOString(),
    })
    .eq("id", lesson.id)
    .select("*, course:courses(*)")
    .single();

  if (result.error) throw new Error(t("error.failed_to_extend_lesson"));

  return result.data;
};
export const updateLesson = async (lesson: TablesUpdate<"lessons">) => {
  const t = await loadMessages();

  const result = await DB.from("lessons").update(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("error.failed_to_update_lesson"));

  return result.data;
};
export const upsertLesson = async (lesson: Lesson) => {
  const t = await loadMessages();

  const result = await DB.from("lessons").upsert(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("error.failed_to_save_lesson"));
};

// DELETE
export const deleteLesson = async (id: string) => {
  const t = await loadMessages();

  const { data, error } = await DB.from("lessons").delete().eq("id", id);

  if (error) throw new Error(t("error.failed_to_delete_lesson"));

  return { data };
};
export const deleteLessons = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_lessons_by_ids", {
    p_lessons_ids: ids,
  });

  if (result.error) throw new Error(t("error.failed_to_delete_lessons"));

  return result;
};
export const deleteAllLessonsFromCourse = async (
  courseId: string,
  title = ""
) => {
  const t = await loadMessages();

  const result = await DB.from("lessons")
    .delete()
    .eq("course_id", courseId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("error.failed_to_delete_lessons"));

  return result;
};
