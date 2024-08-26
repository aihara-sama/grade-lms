import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";

export const createChatMessage = async (
  chatMessage: TablesInsert<"chat_messages">
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("chat_messages")
    .insert(chatMessage)
    .select("*")
    .single();

  if (result.error) throw new Error(t("failed_to_send_message"));

  return result.data;
};

export const getChatMessages = async (lessonId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("chat_messages")
    .select("*")
    .eq("lesson_id", lessonId);

  if (result.error) throw new Error(t("failed_to_load_messages"));

  return result.data;
};
