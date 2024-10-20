"use client";

import { useUser } from "@/hooks/use-user";
import type {
  CreateSubscriptionActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js/types/components/buttons";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { NextPage } from "next";

const Page: NextPage = () => {
  // Hooks
  const [{ isPending }] = usePayPalScriptReducer();
  const { user, setUser } = useUser((state) => state);

  // Handlers
  const createSubscription = async (
    _: Record<string, unknown>,
    actions: CreateSubscriptionActions
  ) => {
    const orderID = await actions.subscription.create({
      // plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
      plan_id: "P-3TH91731HG320143WM4ITYCA",
      custom_id: user.id,
    });

    return orderID;
  };

  const onApprove = async (data: OnApproveData, detail: OnApproveActions) => {
    console.log({ data, detail });
    setUser({ ...user, isPro: true });
  };
  const onError = (err: any) => {
    console.log({ err });
  };

  // View
  return (
    <div>
      {isPending ? (
        "Loading"
      ) : (
        <PayPalButtons
          createSubscription={createSubscription}
          onApprove={onApprove}
          onError={onError}
        ></PayPalButtons>
      )}
    </div>
  );
};

export default Page;
