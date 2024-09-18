import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";
import { v4 as uuid } from "uuid";

export const createChatMessage = async (
  chatMessage: TablesInsert<"chat_messages">
) => {
  const t = await loadMessages();
  const result = await db
    .from("chat_messages")
    .insert(chatMessage)
    .select("*, chat_files(*), author:users(*)")
    .single();

  if (result.error) throw new Error(t("failed_to_send_message"));

  return result.data;
};

export const getChatMessages = async (lessonId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("chat_messages")
    .select("*, chat_files(*), author:users(*)")
    .eq("lesson_id", lessonId);

  if (result.error) throw new Error(t("failed_to_load_messages"));

  return result.data;
};

export const uploadChatFile = async (file: File, ext: string) => {
  const t = await loadMessages();

  const result = await db.storage
    .from("chat-files")
    .upload(`${uuid()}.${ext}`, file);

  if (result.error) throw new Error(t("failed_to_upload_file"));

  return result.data;
};
