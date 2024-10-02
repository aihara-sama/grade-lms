import { DB } from "@/lib/supabase/db";
import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getChatMessages = async (lessonId: string) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("chat_messages")
    .select("*, chat_files(*), author:users(*)", { count: "exact" })
    .eq("lesson_id", lessonId);

  if (error) throw new Error(t("error.failed_to_load_messages"));

  return { data, count };
};

// CREATE
export const createChatMessage = async (
  chatMessage: TablesInsert<"chat_messages">
) => {
  const t = await loadMessages();

  const { data, error } = await DB.from("chat_messages")
    .insert(chatMessage)
    .select("*, chat_files(*), author:users(*)")
    .single();

  if (error) throw new Error(t("error.failed_to_send_message"));

  return data;
};
