import { loadMessages } from "@/utils/load-messages";
import { db } from "@/utils/supabase/client";

export const createBucket = async (name: string) => {
  const t = await loadMessages();
  const result = await db.storage.createBucket(name);

  if (result.error) throw new Error(t("something_went_wrong"));
};
