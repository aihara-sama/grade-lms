import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

export const createAssignment = async (
  assignment: TablesInsert<"assignments">
) => {
  const t = await loadMessages();
  const result = await db
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
  const result = await db
    .from("assignments")
    .update(assignment)
    .eq("id", assignment.id);

  if (result.error) throw new Error(t("failed_to_update_assignment"));
};

export const getAssignmentByAssignmentId = async (assignmentId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("*, lesson:lessons(course_id)")
    .eq("id", assignmentId)
    .single();

  if (result.error) throw new Error(t("failed_to_load_assignment"));

  return result.data;
};
export const getAssignmentsByLessonId = async (lessonId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("*")
    .eq("lesson_id", lessonId)
    .limit(ASSIGNMENTS_GET_LIMIT)
    .order("title", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};

export const getAssignmentsByTitleAndLessonId = async (
  title: string,
  lessonId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("*")
    .ilike("title", `%${title}%`)
    .eq("lesson_id", lessonId)
    .limit(ASSIGNMENTS_GET_LIMIT)
    .order("title", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};

export const getAssignmentsCountByTitleAndLessonId = async (
  title: string,
  lessonId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("count")
    .ilike("title", `%${title}%`)
    .eq("lesson_id", lessonId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_assignments_count"));

  return result.data[0].count;
};

export const getAssignmentsCountByLessonId = async (lessonId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("count")
    .eq("lesson_id", lessonId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_assignments_count"));

  return result.data[0].count;
};

export const getOffsetAssignmentsByTitleAndLessonId = async (
  lessonId: string,
  title: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .select("*")
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("title", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_assignments"));

  return result.data;
};

export const deleteAssignmentsByTitleAndLessonId = async (
  title: string,
  lessonId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("assignments")
    .delete()
    .eq("lesson_id", lessonId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_assignments"));
};

export const deleteAssignmentsByAssignmentsIds = async (
  assignmentsIds: string[]
) => {
  const t = await loadMessages();
  const result = await db.from("assignments").delete().in("id", assignmentsIds);

  if (result.error)
    throw new Error(
      t(
        assignmentsIds.length === 1
          ? "failed_to_delete_assignment"
          : "failed_to_delete_assignments"
      )
    );

  return result;
};

export const deleteAssignment = async (assignmentId: string) => {
  const t = await loadMessages();
  const result = await db.from("assignments").delete().eq("id", assignmentId);

  if (result.error) throw new Error(t("failed_to_delete_assignment"));

  return result.data;
};
