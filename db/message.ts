import { DB } from "@/lib/supabase/db";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getChatMessages = async (lessonId: string) => {
  const t = await loadMessages();

  const result = await DB.from("chat_messages")
    .select("*, chat_files(*), author:users(*)")
    .eq("lesson_id", lessonId);

  if (result.error) throw new Error(t("failed_to_load_messages"));

  return result.data;
};

// CREATE
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
