import { DB } from "@/lib/supabase/db";
import type { TablesInsert, TablesUpdate } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// CREATE
export const createSubmission = async (grade: TablesInsert<"grades">) => {
  const t = await loadMessages();

  const result = await DB.from("grades").insert(grade).select("id").single();

  if (result.error) throw new Error(t("error.failed_to_create_grade"));

  return result.data;
};

// UPDATE
export const updateGrade = async (grade: TablesUpdate<"grades">) => {
  const t = await loadMessages();

  const result = await DB.from("grades").update(grade).eq("id", grade.id);

  if (result.error) throw new Error(t("error.failed_to_update_grade"));
};
export const upsertGrade = async (grade: TablesInsert<"grades">) => {
  const t = await loadMessages();

  const result = await DB.from("grades").upsert(grade).eq("id", grade.id);

  if (result.error) throw new Error(t("error.failed_to_update_grade"));
};
