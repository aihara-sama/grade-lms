import { cancelSubscriptionAction } from "@/actions/cancel-subscription-action";
import { loadMessages } from "@/utils/localization/load-messages";

// UPDATE
export const cancelSubscription = async () => {
  const t = await loadMessages();

  const { error } = await cancelSubscriptionAction();

  if (error) throw new Error(t("error.failed_to_cancel_subscription"));
};
