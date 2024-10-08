import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";
import { addDays, format, subWeeks } from "date-fns";

// GET
export const getAssignment = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("assignments")
    .select("*, lesson:lessons(course_id)")
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_assignment"));

  return result.data;
};
export const getLessonAssignments = async (
  lessonId: string,
  title = "",
  from = 0,
  to = ASSIGNMENTS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("assignments")
    .select("*", { count: "exact" })
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_assignments"));

  return { data, count };
};
export const getAssignmentsInsights = async () => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("assignments")
    .select("timestamp:created_at")
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  if (error) throw new Error(t("error.failed_to_load_assignments_insights"));

  return { data, count };
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

  if (result.error) throw new Error(t("error.failed_to_create_assignment"));

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

  if (result.error) throw new Error(t("error.failed_to_update_assignment"));
};

// DELETE
export const deleteAssignment = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("assignments").delete().eq("id", id);

  if (result.error) throw new Error(t("error.failed_to_delete_assignment"));

  return result.data;
};
export const deleteAssignments = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_assignments_by_ids", {
    p_assignments_ids: ids,
  });

  if (result.error) throw new Error(t("error.failed_to_delete_assignments"));

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

  if (result.error) throw new Error(t("error.failed_to_delete_assignments"));
};
