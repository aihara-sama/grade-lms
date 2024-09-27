import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getAssignment = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .select("*, lesson:lessons(course_id)")
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("failed_to_load_assignment"));

  return result.data;
};
export const getLessonAssignments = async (
  lessonId: string,
  title = "",
  from = 0,
  to = ASSIGNMENTS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .select("*")
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};
export const getLessonAssignmentsCount = async (
  lessonId: string,
  title = ""
) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .select("count")
    .ilike("title", `%${title}%`)
    .eq("lesson_id", lessonId)
    .returns<{ count: number }[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_assignments_count"));

  return result.data.count;
};

export const getLatestAssignments = async () => {
  const t = await loadMessages();

  const result = await DB.from("courses")
    .select("lessons(assignments(*))")
    .limit(ASSIGNMENTS_GET_LIMIT)
    .order("created_at", { ascending: false });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};

// CREATE
export const createAssignment = async (
  assignment: TablesInsert<"assignments">
) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .insert(assignment)
    .select("id")
    .single();

  if (result.error) throw new Error(t("failed_to_create_assignment"));

  return result.data;
};

// UPDATE
export const updateAssignment = async (
  assignment: TablesUpdate<"assignments">
) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .update(assignment)
    .eq("id", assignment.id);

  if (result.error) throw new Error(t("failed_to_update_assignment"));
};

// DELETE
export const deleteAssignment = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("assignments").delete().eq("id", id);

  if (result.error) throw new Error(t("failed_to_delete_assignment"));

  return result.data;
};
export const deleteAssignments = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_assignments_by_ids", {
    p_assignments_ids: ids,
  });

  if (result.error) throw new Error(t("failed_to_delete_assignments"));

  return result;
};
export const deleteAllAssignmentsFromLesson = async (
  lessonId: string,
  title: string
) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .delete()
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_assignments"));
};
