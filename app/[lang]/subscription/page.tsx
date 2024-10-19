"use client";

import type {
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js/types/components/buttons";
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

export default function Home() {
  const [
    { isInitial, isPending, isRejected, isResolved, options },
    paypalDispatch,
  ] = usePayPalScriptReducer();

  console.log({ isInitial, isPending, isRejected, isResolved, options });

  function createSubscription(_: any, actions: any): Promise<string> {
    return actions.subscription
      .create({
        plan_id: "P-3TH91731HG320143WM4ITYCA",
      })
      .then((orderID: string) => {
        return orderID;
      });
  }
  // function createSubscription(_: any, actions: any): Promise<string> {
  //   return actions.subscription
  //     .create({
  //       plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
  //     })
  //     .then((orderID: string) => {
  //       return orderID;
  //     });
  // }

  async function onApprove(data: OnApproveData, detail: OnApproveActions) {
    console.log({ data, detail });

    // return actions.order.subscription().then(async function (details: any) {
    //   console.log({ details });
    // });
  }
  // function onApprove(_: any, actions: any): Promise<void> {
  //   return actions.order.subscription().then(async function (details: any) {
  //     console.log({ details });
  //   });
  // }
  function onError(err: any) {
    console.log({ err });
  }

  useEffect(() => {
    paypalDispatch({
      type: "setLoadingStatus",
      value: SCRIPT_LOADING_STATE.PENDING,
    });
  }, []);

  return (
    <div className="mx-4">
      <h1 className="text-xl font-bold">Subscription</h1>

      <div className="flex justify-between">
        <h1 className="text-lg">Benefits</h1>
        <PayPalButtons
          createSubscription={createSubscription}
          onApprove={onApprove}
          onError={onError}
        ></PayPalButtons>
      </div>
    </div>
  );
}
