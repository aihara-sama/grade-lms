import { DB } from "@/lib/supabase/db";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";
import { v4 as uuid } from "uuid";

export const createChatMessage = async (
  chatMessage: TablesInsert<"chat_messages">
) => {
  const t = await loadMessages();

  const result = await DB.from("chat_messages")
    .insert(chatMessage)
    .select("*, chat_files(*), author:users(*)")
    .single();

  if (result.error) throw new Error(t("failed_to_send_message"));

  return result.data;
};

export const getChatMessages = async (lessonId: string) => {
  const t = await loadMessages();

  const result = await DB.from("chat_messages")
    .select("*, chat_files(*), author:users(*)")
    .eq("lesson_id", lessonId);

  if (result.error) throw new Error(t("failed_to_load_messages"));

  return result.data;
};

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
