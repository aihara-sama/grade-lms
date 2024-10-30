"use server";

import type { ReturnType } from "@/actions/cancel-subscription-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { addMonths } from "date-fns";
import fetch, { Headers } from "node-fetch";

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

  const [maybeSubscription, createdUsers] = await Promise.all([
    adminDB
      .from("subscriptions")
      .select("id, paypal_subscription_id")
      .eq("user_id", user.id)
      .filter("end_date", "is", null)
      .maybeSingle(),
    adminDB.from("users").select("id").eq("creator_id", user.id),
  ]);

  if (!maybeSubscription.data || !createdUsers.error) {
    console.error(maybeSubscription.error);

    return {
      error: "Something went wrong",
      data: null,
    };
  }

  const paypalCanceledSubscribtion = await fetch(
    `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${maybeSubscription.data.paypal_subscription_id}/cancel`,
    {
      method: "POST",
      headers: new Headers({
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ reason: "Not satisfied with the service" }),
    }
  );

  if (paypalCanceledSubscribtion.status !== 204) {
    console.error(paypalCanceledSubscribtion.statusText);

    return {
      error: "Something went wrong",
      data: null,
    };
  }

  const paypalSubscription = (await (
    await fetch(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${maybeSubscription.data.paypal_subscription_id}`,
      {
        headers: new Headers({
          Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
          "Content-Type": "application/json",
        }),
      }
    )
  ).json()) as {
    billing_info: { last_payment: { time: string } };
  };

  const subscription = await adminDB
    .from("subscriptions")
    .update({
      end_date: addMonths(
        paypalSubscription.billing_info.last_payment.time,
        1
      ).toISOString(),
    })
    .eq("id", maybeSubscription.data.id)
    .select("end_date")
    .single();

  if (subscription.error) {
    console.error(subscription.error);

    return {
      error: "Something went wrong",
      data: null,
    };
  }

  await adminDB
    .from("user_settings")
    .update({
      is_emails_on: false,
    })
    .in("user_id", [user.id, ...createdUsers.data]);

  return {
    error: null,
    data: subscription.data,
  };
};

export const cancelSubscriptionAction = handler;
