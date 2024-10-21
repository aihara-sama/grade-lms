import { cancelSubscriptionAction } from "@/actions/cancel-subscription-action";
import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";
import { format } from "date-fns";

// GET
export const getCanceledSubscription = async (userId: string) => {
  const t = await loadMessages();

  const { data, error } = await DB.from("subscriptions")
    .select("end_date")
    .eq("user_id", userId)
    .gte("end_date", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .maybeSingle();

  if (error) throw new Error(t("error.failed_to_load_canceled_subscription"));

  return data;
};

// UPDATE
export const cancelSubscription = async () => {
  const t = await loadMessages();

  const { error } = await cancelSubscriptionAction();

  if (error) throw new Error(t("error.failed_to_cancel_subscription"));
};
