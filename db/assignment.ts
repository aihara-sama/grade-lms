import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { browserDB } from "@/lib/supabase/db/browser-db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

export const getAssignmentById = async (assignmentId: string) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .select("*, lesson:lessons(course_id)")
    .eq("id", assignmentId)
    .single();

  if (result.error) throw new Error(t("failed_to_load_assignment"));

  return result.data;
};
export const getAssignmentsByLessonId = async (
  lessonId: string,
  title = "",
  from = 0,
  to = ASSIGNMENTS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .select("*")
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("title", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};

export const getAssignmentsCountByLessonId = async (
  lessonId: string,
  title = ""
) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .select("count")
    .ilike("title", `%${title}%`)
    .eq("lesson_id", lessonId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_assignments_count"));

  return result.data[0].count;
};

export const createAssignment = async (
  assignment: TablesInsert<"assignments">
) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .insert(assignment)
    .select("id")
    .single();

  if (result.error) throw new Error(t("failed_to_create_assignment"));

  return result.data;
};
export const updateAssignment = async (
  assignment: TablesUpdate<"assignments">
) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .update(assignment)
    .eq("id", assignment.id);

  if (result.error) throw new Error(t("failed_to_update_assignment"));
};

export const deleteLessonsAssignments = async (
  lessonId: string,
  title: string
) => {
  const t = await loadMessages();
  const result = await browserDB.rpc("delete_lesson_assignments", {
    p_lesson_id: lessonId,
    p_title: title,
  });

  if (result.error) throw new Error(t("failed_to_delete_assignments"));
};

export const deleteAssignmentById = async (assignmentId: string) => {
  const t = await loadMessages();
  const result = await browserDB
    .from("assignments")
    .delete()
    .eq("id", assignmentId);

  if (result.error) throw new Error(t("failed_to_delete_assignment"));

  return result.data;
};

export const deleteAssignmentsByIds = async (ids: string[]) => {
  const t = await loadMessages();
  const result = await browserDB.rpc("delete_assignments_by_ids", {
    p_assignments_ids: ids,
  });

  if (result.error) throw new Error(t("failed_to_delete_assignments"));

  return result;
};
