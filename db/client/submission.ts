import { SUBMISSIONS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getSubmission = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .select("*, author:users(*), assignment:assignments(due_date)")
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_submission"));

  return result.data;
};
export const getAssignmentSubmissions = async (
  assignmentId: string,
  title = "",
  from = 0,
  to = SUBMISSIONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("submissions")
    .select("*, author:users(*)", { count: "exact" })
    .eq("assignment_id", assignmentId)
    .ilike("title", `%${title}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_submissions"));

  return { data, count };
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
    .returns<{ count: number }[]>()
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_submissions"));

  return result.data.count;
};

// CREATE
export const createSubmission = async (
  submission: TablesInsert<"submissions">
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .insert(submission)
    .select("id")
    .single();

  if (result.error) throw new Error(t("error.failed_to_create_submission"));

  return result.data;
};

// UPDATE
export const updateSubmission = async (
  submission: TablesUpdate<"submissions">
) => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .update(submission)
    .eq("id", submission.id);

  if (result.error) throw new Error(t("error.failed_to_update_submission"));
};

// DELETE
export const deleteSubmission = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("submissions").delete().eq("id", id);

  if (result.error) throw new Error(t("error.failed_to_delete_submission"));

  return result;
};
export const deleteSubmissions = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("delete_submissions_by_ids", {
    p_submissions_ids: ids,
  });

  if (result.error) throw new Error(t("error.failed_to_delete_submissions"));

  return result;
};
export const deleteAllSubmissions = async (title = "") => {
  const t = await loadMessages();

  const result = await DB.from("submissions")
    .delete()
    .ilike("title", `%${title}%`);

  if (result.error) throw new Error(t("error.failed_to_delete_submissions"));

  return result;
};
