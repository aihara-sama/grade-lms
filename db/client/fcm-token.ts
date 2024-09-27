import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";

// GET
export const getFcmToken = async () => {
  const t = await loadMessages();

  const result = await DB.from("fcm_tokens").select("fcm_token").maybeSingle();

  if (result.error) throw new Error(t("something_went_wrong"));

  return result.data;
};

// CREATE
export const createFcmToken = async (token: string) => {
  const t = await loadMessages();

  const result = await DB.from("fcm_tokens").insert({
    fcm_token: token,
  });

  if (result.error) throw new Error(t("something_went_wrong"));
};
