import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";
import { v4 as uuid } from "uuid";

// CREATE
export const uploadChatFile = async (
  courseId: string,
  file: File,
  ext: string
) => {
  const t = await loadMessages();

  const result = await DB.storage
    .from("courses")
    .upload(`${courseId}/${uuid()}.${ext}`, file);

  if (result.error) throw new Error(t("failed_to_upload_file"));

  return result.data;
};
