import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

export const createSubmission = async (
  submission: TablesInsert<"submissions">
) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .insert(submission)
    .select("id")
    .single();

  if (result.error) throw new Error(t("failed_to_create_submission"));

  return result.data;
};

export const updateSubmission = async (
  submission: TablesUpdate<"submissions">
) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .update(submission)
    .eq("id", submission.id);

  if (result.error) throw new Error(t("failed_to_update_submission"));
};

export const getAssignmentSubmissionsWithAuthor = async (
  assignmentId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .select("*, author:users(*)")
    .eq("assignment_id", assignmentId)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const getUserSubmissionsWithAuthor = async (
  assignmentId: string,
  userId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .select("*, author:users(*)")
    .eq("assignment_id", assignmentId)
    .eq("user_id", userId)
    .range(from, to);

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const getSubmissionWithAuthorById = async (id: string) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .select("*, author:users(*), assignment:assignments(due_date)")
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const updateSubmissionGrade = async (
  submissionId: string,
  grade: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("submissions")
    .update({ grade })
    .eq("id", submissionId);

  if (result.error) throw new Error(t("failed_to_update_submission_grade"));
};
