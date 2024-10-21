"use server";

import type { ReturnType } from "@/actions/delete-all-users-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

const handler = async (): Promise<ReturnType> => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  const { data: maybeSubscription, error } = await adminDB
    .from("subscriptions")
    .select("id, paypal_subscription_id")
    .eq("user_id", user.id)
    .eq("end_date", null)
    .maybeSingle();

  if (!maybeSubscription) {
    console.error(error);

    return {
      error: "Something went wrong",
      data: null,
    };
  }

  const { status, json } = await fetch(
    `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${maybeSubscription.paypal_subscription_id}`,
    {
      method: "POST",
      headers: new Headers({
        Authorization: `Basic ${window.btoa(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        )}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ reason: "Not satisfied with the service" }),
    }
  );

  if (status !== 204) {
    console.error(await json());

    return {
      error: "Something went wrong",
      data: null,
    };
  }

  return {
    error: null,
    data: null,
  };
};

export const cancelSubscriptionAction = handler;
