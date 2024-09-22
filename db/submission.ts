import { SUBMISSIONS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

export const getAssignmentSubmissions = async (
  assignmentId: string,
  title = "",
  from = 0,
  to = SUBMISSIONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("*, author:users(*)")
    .eq("assignment_id", assignmentId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const getAssignmentSubmissionsCount = async (
  assignmentId: string,
  title = ""
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("count")
    .eq("assignment_id", assignmentId)
    .ilike("title", `%${title}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data[0].count;
};
export const getUserSubmissions = async (
  userId: string,
  assignmentId: string,
  title = "",
  from = 0,
  to = SUBMISSIONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("*, author:users(*)")
    .eq("assignment_id", assignmentId)
    .eq("user_id", userId)
    .ilike("title", `%${title}%`)
    .range(from, to);

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const getUserSubmissionsCount = async (
  userId: string,
  assignmentId: string,
  title = ""
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("count")
    .eq("assignment_id", assignmentId)
    .eq("user_id", userId)
    .ilike("title", `%${title}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data[0].count;
};
export const getSubmissionById = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("*, author:users(*), assignment:assignments(due_date)")
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};

export const createSubmission = async (
  submission: TablesInsert<"submissions">
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
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

  const result = await DB.from("submissions")
    .update(submission)
    .eq("id", submission.id);

  if (result.error) throw new Error(t("failed_to_update_submission"));
};

export const updateSubmissionGrade = async (
  submissionId: string,
  grade: number
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .update({ grade })
    .eq("id", submissionId);

  if (result.error) throw new Error(t("failed_to_update_submission_grade"));
};

export const deleteSubmissionById = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("submissions").delete().eq("id", id);

  if (result.error) throw new Error(t("failed_to_delete_submission"));

  return result;
};
export const deleteSubmissionsByIds = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_submissions_by_ids", {
    p_submissions_ids: ids,
  });

  if (result.error) throw new Error(t("failed_to_delete_submissions"));

  return result;
};
export const deleteAllMySubmissions = async (meId: string, title = "") => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .delete()
    .eq("user_id", meId)
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("failed_to_delete_submissions"));

  return result;
};
