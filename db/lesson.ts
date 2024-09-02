import { LESSONS_GET_LIMIT } from "@/constants";
import type { Lesson } from "@/types/lessons.type";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";
import { format } from "date-fns";

export const deleteLessonsByLessonsIds = async (lessonsIds: string[]) => {
  const t = await loadMessages();
  const result = await db.from("lessons").delete().in("id", lessonsIds);

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

export const getOverlappingLessons = async (
  starts: string,
  ends: string,
  userId: string
) => {
  const t = await loadMessages();

  const result = await db.rpc("get_overlapping_lesson", {
    p_user_id: userId,
    p_ends: ends,
    p_starts: starts,
  });
  if (result.error) throw new Error(t("something_went_wrong"));

  return result.data;
};

export const createLesson = async (lesson: TablesInsert<"lessons">) => {
  const t = await loadMessages();

  const result = await db.from("lessons").insert(lesson);

  if (result.error) throw new Error(t("failed_to_create_lesson"));
};

export const getLessonsCountByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
    .select("lessons(count)")
    .eq("id", courseId)
    .returns<Record<"lessons", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_lessons_count"));

  return result.data.lessons[0].count;
};
export const getWeekLessons = async (days: string[], courseId?: string) => {
  const t = await loadMessages();
  const builder = db
    .from("lessons")
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

export const getLessonsCountByTitleAndCourseId = async (
  title: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await db
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
  const result = await db
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
  const result = await db
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
  const result = await db
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
  const result = await db.from("lessons").upsert(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_save_lesson"));
};

export const deleteLessonsByTitleAndCourseId = async (
  title: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("lessons")
    .delete()
    .eq("course_id", courseId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_lessons"));

  return result;
};

export const extendLesson = async (lesson: Lesson, miliseconds: number) => {
  const t = await loadMessages();

  const result = await db
    .from("lessons")
    .update({
      ends: format(
        +new Date(lesson.ends) + miliseconds,
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
    })
    .eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_extend_lesson"));
};
export const updateLesson = async (lesson: TablesUpdate<"lessons">) => {
  const t = await loadMessages();
  const result = await db.from("lessons").update(lesson).eq("id", lesson.id);

  if (result.error) throw new Error(t("failed_to_update_lesson"));

  return result.data;
};

export const getLessonById = async (id: string) => {
  const t = await loadMessages();
  const result = await db.from("lessons").select("*").eq("id", id).single();

  if (result.error) throw new Error(t("failed_to_load_lesson"));

  return result.data;
};
