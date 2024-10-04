import { NOTIFICATIONS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getNotification = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("notifications")
    .select(
      "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)"
    )
    .eq("id", id)
    .single();

  if (result.error) throw new Error(t("error.failed_to_load_notifications"));

  return result.data;
};
export const getNotifications = async (
  from = 0,
  to = NOTIFICATIONS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("notifications")
    .select(
      "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(t("error.failed_to_load_notifications"));

  return { data, count };
};

// UPDATE
export const readNotification = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (result.error) console.error(t("error.failed_to_read_notification"));

  return result.data;
};
export const getNewNotificationsCount = async () => {
  const t = await loadMessages();
  const result = await DB.from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (result.error)
    throw new Error(t("error.failed_to_load_new_notifications_count"));

  return result.count;
};
