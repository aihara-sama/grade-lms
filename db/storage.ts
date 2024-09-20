import { DB } from "@/lib/supabase/db/browser-db";
import { loadMessages } from "@/utils/localization/load-messages";

export const createBucket = async (name: string) => {
  const t = await loadMessages();
  const result = await DB.storage.createBucket(name);

  if (result.error) throw new Error(t("something_went_wrong"));
};
