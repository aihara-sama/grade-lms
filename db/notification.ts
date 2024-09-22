import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getNotifications = async (from: number, to: number) => {
  const t = await loadMessages();

  const result = await DB.from("notifications")
    .select(
      "id, is_read, type, created_at, course:courses(title, id), lesson:lessons(title, id), assignment:assignments(title), user:users!inner(name)"
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (result.error) throw new Error(t("failed_to_load_notifications"));

  return result.data;
};

// UPDATE
export const readNotification = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (result.error) console.error(t("failed_to_read_notification"));

  return result.data;
};
