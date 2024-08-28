import type { TablesInsert } from "@/types/supabase.type";
import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

export const createNotification = async (
  notification: TablesInsert<"notifications">
) => {
  const t = await loadMessages();
  const result = await db.from("notifications").insert(notification);

  if (result.error) console.error(t("failed_to_create_notification"));
};

export const getNotifications = async (userId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("notifications")
    .select(
      "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)"
    )
    .eq("users.id", userId);

  if (result.error) throw new Error(t("failed_to_load_notifications"));

  return result.data;
};

export const readNotification = async (notificationId: string) => {
  const t = await loadMessages();
  const result = await db
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (result.error) console.error(t("failed_to_read_notification"));

  return result.data;
};
