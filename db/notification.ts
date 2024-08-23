import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { supabaseClient } from "@/utils/supabase/client";

export const createNotification = async (
  notification: TablesInsert<"notifications">
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("notifications")
    .insert(notification);

  if (result.error) console.error(t("failed_to_create_notification"));
};
