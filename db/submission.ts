import { SUBMISSIONS_GET_LIMIT } from "@/constants";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";

export const getSubmissionsWithAuthorByAssignmentId = async (
  assignmentId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("submissions")
    .select("*, author:users(*)")
    .eq("assignment_id", assignmentId)
    .limit(SUBMISSIONS_GET_LIMIT);

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const getSubmissionWithAuthorBySubmissionId = async (
  submissionId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("submissions")
    .select("*, author:users(*)")
    .eq("id", submissionId)
    .single();

  if (result.error) throw new Error(t("failed_to_load_submissions"));

  return result.data;
};
export const updateSubmissionGrade = async (
  submissionId: string,
  grade: number
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("submissions")
    .update({ grade })
    .eq("id", submissionId);

  if (result.error) throw new Error(t("failed_to_update_submission_grade"));
};
